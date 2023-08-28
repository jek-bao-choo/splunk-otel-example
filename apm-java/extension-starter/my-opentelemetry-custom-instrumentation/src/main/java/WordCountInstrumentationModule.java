import static java.util.Collections.singletonList;

import com.google.auto.service.AutoService;
import io.opentelemetry.javaagent.extension.instrumentation.InstrumentationModule;
import io.opentelemetry.javaagent.extension.instrumentation.TypeInstrumentation;
import io.opentelemetry.javaagent.extension.matcher.AgentElementMatchers;
import java.util.List;
import net.bytebuddy.matcher.ElementMatcher;

@AutoService(InstrumentationModule.class)
public class WordCountInstrumentationModule extends InstrumentationModule {

    public WordCountInstrumentationModule() {
        super("my-wordcount-demo", "mywordcount");
    }

    @Override
    public int order() {
        return 1;
    }

    @Override
    public List<String> getAdditionalHelperClassNames() {
        return List.of(WordCountInstrumentation.class.getName(),"io.opentelemetry.javaagent.extension.instrumentation.TypeInstrumentation");
    }

    @Override
    public ElementMatcher.Junction<ClassLoader> classLoaderMatcher() {
        return AgentElementMatchers.hasClassesNamed("org.mysimplejava.Main");
    }

    @Override
    public List<TypeInstrumentation> typeInstrumentations() {
        return singletonList(new WordCountInstrumentation());
    }

}
