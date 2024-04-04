// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use window_shadows::set_shadow;
// use window_vibrancy::apply_acrylic;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

fn start_timer(window: tauri::Window) {
    std::thread::spawn(move || {
        let mut timer = 0;
        loop {
            timer += 1;
            let _ = window.emit("updateTimer", timer);
            std::thread::sleep(std::time::Duration::from_secs(1));
        }
    });
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_timer])
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            // #[cfg(target_os = "windows")]
            // apply_acrylic(&window, Some((255, 0, 0, 255)))
            //     .expect("Unsupported platform! 'apply_acrylic' is only supported on Windows 11");

            #[cfg(target_os = "windows")]
            set_shadow(&window, true).unwrap();

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
