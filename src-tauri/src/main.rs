// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{App, CustomMenuItem, Error, Manager, PhysicalPosition, SystemTray, SystemTrayEvent, SystemTrayMenu};
use tauri_plugin_autostart::MacosLauncher;
use std::{sync::{atomic::AtomicBool, Mutex}, time::SystemTime};

static WINDOW_ALWAYS_ON_TOP: AtomicBool = AtomicBool::new(false);
static WINDOW_CLOSED_AT: Mutex<Option<SystemTime>> = Mutex::new(None);

fn setup_system_tray(app: &App) -> Result<(), Error> {
    let handle = app.handle();
    SystemTray::new()
        .with_menu(SystemTrayMenu::new().add_item(
            CustomMenuItem::new("quit".to_string(), "Quit")
        ))
        .on_event(move |event| {
            match event {
            SystemTrayEvent::LeftClick { .. } => {
                let window = handle.get_window("main").unwrap();
                if window.is_visible().unwrap() {
                    window.hide().unwrap();
                } else {
                    if let Some(closed_at) = *WINDOW_CLOSED_AT.lock().unwrap() {
                        if closed_at.elapsed().unwrap().as_millis() < 250 {
                            return;
                        }
                    }
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
            }
            SystemTrayEvent::MenuItemClick { id, .. } => {
                if id == "quit" {
                    std::process::exit(0)
                }
            }
            _ => {}
            }
        })
        .build(app)?;
    Ok(())
}

fn setup_window(app: &App) -> Result<(), Error> {
    let window = app.get_window("main").unwrap();
    let monitor_result = window.current_monitor();
    match monitor_result {
        Ok(monitor_option) => match monitor_option {
            Some(monitor) => {
                let monitor_size = monitor.size();
                let window_size = window.inner_size();
                if window_size.is_ok() {
                    let window_size = window_size.unwrap();
                    let x = monitor_size.width as f64 - window_size.width as f64 - 16.0;
                    let y = monitor_size.height as f64 - window_size.height as f64 - 64.0;
                    window.set_position(PhysicalPosition { x, y }).unwrap();
                }
            },
            None => println!("monitor not found"),
        },
        Err(e) => println!("err: {}", e),
    }
    let handle = app.handle();
    window.on_window_event(move |event| {
        if let tauri::WindowEvent::Focused(false) = event {
            if !WINDOW_ALWAYS_ON_TOP.load(std::sync::atomic::Ordering::SeqCst) {
                WINDOW_CLOSED_AT.lock().unwrap().replace(SystemTime::now());
                let window = handle.get_window("main").unwrap();
                window.hide().unwrap();
            }
        }
    });
    Ok(())
}

#[tauri::command]
fn update_always_on_top_state() {
    WINDOW_ALWAYS_ON_TOP.store(!WINDOW_ALWAYS_ON_TOP.load(std::sync::atomic::Ordering::SeqCst), std::sync::atomic::Ordering::SeqCst);
}

fn main() {
    WINDOW_CLOSED_AT.lock().unwrap().replace(SystemTime::now());
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(MacosLauncher::LaunchAgent, Some(vec![])))
        .setup(|app| {
            setup_system_tray(&app).unwrap();
            setup_window(&app).unwrap();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![update_always_on_top_state])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

