
// Import necessary libraries.
// ElementMatchers helps to define custom matchers for Byte Buddy's ElementMatcher interface.
import static net.bytebuddy.matcher.ElementMatchers.namedOneOf;

// OpenTelemetry libraries for tracing capabilities
import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.StatusCode;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.context.Scope;

// Libraries for Java agent instrumentation
import io.opentelemetry.javaagent.extension.instrumentation.TypeInstrumentation;
import io.opentelemetry.javaagent.extension.instrumentation.TypeTransformer;

// Byte Buddy libraries for method intercepting
import net.bytebuddy.asm.Advice;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

// Java logging library
import java.util.logging.Logger;

public class WordCountInstrumentation implements TypeInstrumentation {

    private static final Logger logger = Logger.getLogger(WordCountInstrumentation.class.getName());

    @Override
    public ElementMatcher<TypeDescription> typeMatcher() {
        logger.info("TEST typeMatcher");
        return ElementMatchers.named("org.mysimplejava.Main");
    }

    @Override
    public void transform(TypeTransformer typeTransformer) {
        logger.info("TEST transform");
        typeTransformer.applyAdviceToMethod(namedOneOf("countWords"),this.getClass().getName() + "$WordCountAdvice");
    }

    public static class WordCountAdvice {

//        public static final Logger logger = Logger.getLogger(WordCountInstrumentation.class.getName()); // no use because can't use logger.info...

        @Advice.OnMethodEnter(suppress = Throwable.class)
        public static Scope onEnter(@Advice.Argument(value = 0) String input, @Advice.Local("otelSpan") Span span) {
//            logger.info("TEST onEnter"); // having this would crash
            // Create a new span.
            Tracer tracer = GlobalOpenTelemetry.getTracer("my-instrumentation-library-name", "semver:1.0.1");
            System.out.print("my-instrumentation-library-name is entering the method");
            span = tracer.spanBuilder("mySpanName").startSpan();
            // Set some attributes on the span.
            span.setAttribute("input", input);
            // Make the span active.
            // Return the Scope instance. This will be used in the exit advice to end the span's scope.
            return span.makeCurrent();
        }

        @Advice.OnMethodExit(onThrowable = Throwable.class, suppress = Throwable.class)
        public static void onExit(@Advice.Return(readOnly = false) int wordCount,
                                  @Advice.Thrown Throwable throwable,
                                  @Advice.Local("otelSpan") Span span,
                                  @Advice.Enter Scope scope) {
//            logger.info("TEST onExit"); // having this would crash
            // Close the scope to end it.
            scope.close();
            // If the method threw an exception, set the span's status to error.
            if (throwable != null) {
                span.setStatus(StatusCode.ERROR, "Exception thrown in method");
            } else {
                // If no exception was thrown, set a custom attribute "wordCount" on the span.
                span.setAttribute("wordCount", wordCount);
            }

            // End the span. This makes it ready to be exported to the configured exporter (e.g., Jaeger, Zipkin).
            span.end();

            System.out.print("ByteBuddy Advice is exiting the method");
        }

    }



}
