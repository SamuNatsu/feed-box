// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod feed;

use feed::fetch_feed;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![fetch_feed])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
