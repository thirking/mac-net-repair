mod commands;

use commands::{
    diagnostics::{ping_host, reset_network},
    dns::{flush_dns_cache, get_dns_servers, set_dns_servers},
    network::{
        create_network_service, get_available_hardware_ports, get_network_services,
        get_service_order, remove_network_service, set_service_order,
    },
    proxy::{clear_all_proxies, get_proxy_settings},
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_network_services,
            get_service_order,
            set_service_order,
            get_available_hardware_ports,
            create_network_service,
            remove_network_service,
            get_proxy_settings,
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
