import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/js/**/*.js',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    primary: 'rgb(var(--color-brand-primary) / <alpha-value>)',
                    secondary: 'rgb(var(--color-brand-secondary) / <alpha-value>)',
                    light: 'rgb(var(--color-brand-light) / <alpha-value>)',
                    bg: 'rgb(var(--color-brand-bg) / <alpha-value>)',
                    dark: 'rgb(var(--color-brand-dark) / <alpha-value>)',
                }
            }
        },
    },

    plugins: [forms],
};
