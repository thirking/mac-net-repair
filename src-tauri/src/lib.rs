mod commands;

use commands::{
    diagnostics::{ping_host, reset_network},
    dns::{flush_dns_cache, get_dns_servers, set_dns_servers},
    network::{
        create_network_service, get_available_hardware_ports, get_network_services,
        get_service_order, remove_network_service, set_service_order,
    },
    proxy::{
        clear_all_proxies, get_proxy_settings, set_http_proxy, set_https_proxy, set_socks_proxy,
    },
};
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_decorum::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            #[cfg(target_os = "macos")]
            {
                use tauri_plugin_decorum::WebviewWindowExt;
                window.create_overlay_titlebar().unwrap();
                window.set_traffic_lights_inset(12.0, 16.0).unwrap();
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_network_services,
            get_service_order,
            set_service_order,
            get_available_hardware_ports,
            create_network_service,
            remove_network_service,
            get_proxy_settings,
            set_http_proxy,
            set_https_proxy,
            set_socks_proxy,
            clear_all_proxies,
            get_dns_servers,
            set_dns_servers,
            flush_dns_cache,
            ping_host,
            reset_network,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
