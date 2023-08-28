package org.mysimplejava;

import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        System.out.print("Hello and welcome!");
        for (int i = 1; i <= 5; i++) {

            System.out.println("i = " + i);
        }

        // write a program waiting for user input and count the number of words in the sentence
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter a sentence: ");
        String i = scanner.nextLine();
        Main m = new Main();
        int number = m.countWords(i);
        System.out.println("Your sentence has: " + number + " words.");
    }

    public int countWords(String words) {
        try {
            Thread.sleep(19876);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        if (words == null || words.isEmpty()) {
            return 0;
        }

        String[] afterSplit = words.split("\\s+");
        return afterSplit.length;
    }
}