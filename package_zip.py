#!/usr/bin/env python3
"""
NSBM NewsDesk — Campus Pulse Zip Packaging Script
Generates a complete, clean, ready-to-deploy zip archive for LAMP / cPanel / Apache hosting.
"""

import os
import zipfile

def package_project():
    output_filename = "nsbm_newsdesk_campus_pulse.zip"
    print(f"Creating project package: {output_filename}...")

    # Files and folders to include
    include_files = [
        "index.html",
        "news.html",
        "pulse.html",
        "submit.html",
        "login.html",
        "register.html",
        "profile.html",
        "bookmarks.html",
        "README.txt",
        "data.php",
    ]

    include_dirs = [
        "admin",
        "css",
        "js",
        "backend",
        "database",
        "images"
    ]

    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file in include_files:
            if os.path.exists(file):
                zipf.write(file, arcname=file)
                print(f"  + Added: {file}")

        for folder in include_dirs:
            if os.path.exists(folder):
                for root, _, files in os.walk(folder):
                    for file in files:
                        full_path = os.path.join(root, file)
                        # Relative path inside zip
                        arcname = os.path.relpath(full_path, start=".")
                        zipf.write(full_path, arcname=arcname)
                        print(f"  + Added: {arcname}")

    print(f"✓ Successfully generated {output_filename} ({os.path.getsize(output_filename)} bytes)")

if __name__ == "__main__":
    package_project()
