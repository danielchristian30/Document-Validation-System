import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"DM Sans"', ...defaultTheme.fontFamily.sans],
                montserrat: ['Montserrat', 'sans-serif'],
                dmsans: ['"DM Sans"', 'sans-serif'],
                mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
            },
            colors: {
                sivaldok: {
                    red: '#E6001A',          // Brand Red (Bar identitas 4px)
                    maroon: '#8B0F14',       // Primary Maroon (Aksi utama)
                    maroonHover: '#6B0A0F',  // Primary Hover
                    tint: '#FCEBEC',         // Primary Tint
                    gold: '#FFB400',         // Gold
                    bg: '#F5F5F5',           // Page BG
                    surface: '#FFFFFF',      // Surface
                    charcoal: '#262626',     // Teks Utama / Charcoal
                    slate: '#7F8C8D',        // Teks Sekunder / Slate
                    border: '#E5E7EB',       // Border
                    success: '#1E8E3E',      // Status Success
                    danger: '#D92020',       // Status Danger
                    warning: '#F5A300',      // Status Warning
                    info: '#1A73E8',         // Status Info
                },
            },
            borderRadius: {
                'sivaldok': '8px', // Standar Radius 8 SIVALDOK
            },
        },
    },

    plugins: [forms],
};