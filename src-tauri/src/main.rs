// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use auto_launch::AutoLaunchBuilder;
use tauri::{App, CustomMenuItem, Error, Manager, PhysicalPosition, SystemTray, SystemTrayEvent, SystemTrayMenu};
use std::{sync::{atomic::AtomicBool, Mutex}, time::SystemTime};

static WINDOW_ALWAYS_ON_TOP: AtomicBool = AtomicBool::new(false);
static WINDOW_LOST_FOCUS_AT: Mutex<Option<SystemTime>> = Mutex::new(None);
static IGNORE_UNFOCUS_UNTIL: Mutex<Option<SystemTime>> = Mutex::new(None);
static WINDOW_NEVER_OPENED: AtomicBool = AtomicBool::new(true);

fn setup_system_tray(app: &App) -> Result<(), Error> {
    let handle = app.handle();
    SystemTray::new()
        .with_menu(SystemTrayMenu::new().add_item(
            CustomMenuItem::new("quit".to_string(), "Quit")
        ))
        .on_event(move |event| {
            match event {
            SystemTrayEvent::LeftClick { .. } => {
                if WINDOW_LOST_FOCUS_AT.lock().unwrap().unwrap().elapsed().unwrap().as_millis() < 250 {
                    if WINDOW_NEVER_OPENED.load(std::sync::atomic::Ordering::SeqCst) {
                        WINDOW_NEVER_OPENED.store(false, std::sync::atomic::Ordering::SeqCst);
                    } else {
                        return;
                    }
                }
                let window = handle.get_window("main").unwrap();
                if WINDOW_ALWAYS_ON_TOP.load(std::sync::atomic::Ordering::SeqCst) {
                    if window.is_visible().unwrap() {
                        window.hide().unwrap();
                    } else {
                        window.show().unwrap();
                    }
                    return;
                }
                if window.is_visible().unwrap() {
                    if window.is_focused().unwrap() {
                        window.hide().unwrap();
                    } else {
                        window.set_focus().unwrap();
                    }
                } else {
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
            if IGNORE_UNFOCUS_UNTIL.lock().unwrap().unwrap().elapsed().unwrap().as_secs() < 1 {
                return;
            }
            if !WINDOW_ALWAYS_ON_TOP.load(std::sync::atomic::Ordering::SeqCst) {
                let window = handle.get_window("main").unwrap();
                window.hide().unwrap();
                WINDOW_LOST_FOCUS_AT.lock().unwrap().replace(SystemTime::now());
            }
        }
        if let tauri::WindowEvent::CloseRequested { api, .. } = event {
            api.prevent_close();
            let window = handle.get_window("main").unwrap();
            window.hide().unwrap();
        }
    });
    Ok(())
}

#[tauri::command]
fn update_always_on_top_state() {
    WINDOW_ALWAYS_ON_TOP.store(!WINDOW_ALWAYS_ON_TOP.load(std::sync::atomic::Ordering::SeqCst), std::sync::atomic::Ordering::SeqCst);
}

#[tauri::command]
fn ignore_unfocus_for_a_second() {
    IGNORE_UNFOCUS_UNTIL.lock().unwrap().replace(SystemTime::now());
}

fn setup_auto_launch(app: &App) -> Result<(), Error> {
    WINDOW_LOST_FOCUS_AT.lock().unwrap().replace(SystemTime::now());
    IGNORE_UNFOCUS_UNTIL.lock().unwrap().replace(SystemTime::now());
    let app_name = &app.package_info().name;
    let current_exe = std::env::current_exe().unwrap();
    let auto_start = AutoLaunchBuilder::new()
        .set_app_name(&app_name)
        .set_app_path(&current_exe.to_str().unwrap())
        .build()
        .unwrap();
    auto_start.enable().unwrap();
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            setup_auto_launch(&app).unwrap();
            setup_system_tray(&app).unwrap();
            setup_window(&app).unwrap();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![update_always_on_top_state, ignore_unfocus_for_a_second])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
