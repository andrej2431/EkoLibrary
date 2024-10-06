use dotenv::dotenv;
use std::env;
use std::sync::Arc;
use warp::Filter;
use serde::Serialize;
use tokio_postgres::{NoTls, Error};

#[derive(Serialize, Clone)]
struct Species {
    id: i32,
    name: String,
    latin_name: String,
    life_expectancy: i32,
    habitat: String,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenv().ok();
    let host = env::var("DB_HOST").expect("DB_HOST must be set");
    let port = env::var("DB_PORT").unwrap_or_else(|_| "5432".to_string()); // Default to 5432 if not set
    let db_name = env::var("DB_NAME").expect("DB_NAME must be set");
    let user = env::var("DB_USER").expect("DB_USER must be set");
    let password = env::var("DB_PASSWORD").expect("DB_PASSWORD must be set");

    let table_name = "species";

    let conn_str = format!(
        "host={} dbname={} user={} password={} port={}",
        host, db_name, user, password, port
    );

    let (client, connection) = tokio_postgres::connect(&conn_str, NoTls).await?;

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("Connection error: {}", e);
        }
    });

    let species_list = Arc::new(fetch_species_list(&client, table_name).await?);
        let species_list_temp = Arc::clone(&species_list);

    let cors = warp::cors()
    .allow_any_origin()
    .allow_methods(vec!["GET"])
    .allow_headers(vec!["Content-Type"]);


    let species_by_id = warp::path!("api"/ "species" / i32)
        .map(move |id: i32| {
            
            let species = species_list_temp.iter().find(|s| s.id == id);
            match species {
                Some(s) => warp::reply::json(s),
                None => warp::reply::json(&"Species not found")
            }
        })
        .with(cors.clone());


    let species_by_name = warp::path("api")
        .and(warp::get())
        .and(warp::query::<std::collections::HashMap<String, String>>())
        .map(move |params: std::collections::HashMap<String, String>| {
            let prefix = params.get("prefix").unwrap_or(&"".to_string()).to_lowercase();
            let filtered_species: Vec<&Species> = species_list
                .iter()
                .filter(|s| s.name.to_lowercase().starts_with(&prefix))
                .collect();

            warp::reply::json(&filtered_species)
        })
        .with(cors);

    let routes = species_by_id.or(species_by_name);

    warp::serve(routes).run(([127, 0, 0, 1], 3030)).await;

    Ok(())
}

async fn fetch_species_list(client: &tokio_postgres::Client, table_name: &str) -> Result<Vec<Species>, Error> {
    let query = format!("SELECT id, name, latin_name, life_expectancy, habitat FROM {}", table_name);
    let rows = client.query(query.as_str(), &[]).await?;

    let species_list: Vec<Species> = rows
        .iter()
        .map(|row| Species {
            id: row.get(0),
            name: row.get(1),
            latin_name: row.get(2),
            life_expectancy: row.get(3),
            habitat: row.get(4),
        })
        .collect();

    Ok(species_list)
}