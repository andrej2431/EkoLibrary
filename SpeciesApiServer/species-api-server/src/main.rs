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
    
    let db_name = "species_db";
    let user = "species_admin";
    let password = "T4V*KBJGonrKjl";
    let table_name = "species";

    let conn_str = format!(
        "host=localhost dbname={} user={} password={}",
        db_name, user, password
    );

    let (client, connection) = tokio_postgres::connect(&conn_str, NoTls).await?;

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("Connection error: {}", e);
        }
    });

    let species_list = fetch_species_list(&client, table_name).await?;

    let cors = warp::cors()
    .allow_any_origin() // Allows requests from any origin
    .allow_methods(vec!["GET"]) // Allow only GET requests
    .allow_headers(vec!["Content-Type"]); // Allow these headers

    let species = warp::path("api")
        .and(warp::get())
        .and(warp::query::<std::collections::HashMap<String, String>>()) // Capture query parameters
        .map(move |params: std::collections::HashMap<String, String>| {
            let prefix = params.get("prefix").unwrap_or(&"".to_string()).to_lowercase();
            let filtered_species: Vec<&Species> = species_list
                .iter()
                .filter(|s| s.name.to_lowercase().starts_with(&prefix))
                .collect();

            warp::reply::json(&filtered_species)
        })
        .with(cors);

    warp::serve(species).run(([127, 0, 0, 1], 3030)).await;

    Ok(())
}

async fn fetch_species_list(client: &tokio_postgres::Client, table_name: &str) -> Result<Vec<Species>, Error> {
    let query = format!("SELECT id, name, latin_name, life_expectancy, habitat FROM {}", table_name);
    let rows = client.query(query.as_str(), &[]).await?;

    // Map rows to Species struct
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

    Ok(species_list) // Return Ok(species_list) to satisfy the Result return type
}