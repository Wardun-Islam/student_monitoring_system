package com.example.readingprogresstracker;

import androidx.fragment.app.Fragment;

interface NavigationHost {
    void navigateTo(Fragment fragment, Boolean addToBackStack);
}
