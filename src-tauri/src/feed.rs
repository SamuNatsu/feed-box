// Feed module

use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct Feed {
    pub feed_type: &'static str,
    pub id: String,
    pub title: Option<String>,
    pub updated: Option<i64>,
    //pub authors: Vec<Person>,
    pub description: Option<String>,
    pub links: Vec<String>,
    //pub categories: Vec<Category>,
    //pub contributors: Vec<Person>,
    //pub generator: Option<Generator>,
    //pub icon: Option<Image>,
    //pub language: Option<String>,
    //pub logo: Option<Image>,
    pub published: Option<i64>,
    //pub rating: Option<MediaRating>,
    //pub rights: Option<Text>,
    //pub ttl: Option<u32>,
    pub entries: Vec<Entry>,
}

impl From<feed_rs::model::Feed> for Feed {
    fn from(value: feed_rs::model::Feed) -> Self {
        Self {
            feed_type: match value.feed_type {
                feed_rs::model::FeedType::Atom => "Atom",
                feed_rs::model::FeedType::JSON => "Json",
                feed_rs::model::FeedType::RSS0 => "RSS0",
                feed_rs::model::FeedType::RSS1 => "RSS1",
                feed_rs::model::FeedType::RSS2 => "RSS2",
            },
            id: value.id,
            title: value.title.map(|v| v.content),
            updated: value.updated.map(|v| v.timestamp()),
            description: value.description.map(|v| v.content),
            links: value.links.into_iter().map(|v| v.href).collect(),
            published: value.published.map(|v| v.timestamp()),
            entries: value.entries.into_iter().map(|v| Entry::from(v)).collect(),
        }
    }
}

#[derive(Deserialize, Serialize)]
pub struct Entry {
    pub id: String,
    pub title: Option<String>,
    pub updated: Option<i64>,
    //pub authors: Vec<Person>,
    pub content: Option<String>,
    pub links: Vec<String>,
    pub summary: Option<String>,
    //pub categories: Vec<Category>,
    //pub contributors: Vec<Person>,
    pub published: Option<i64>,
    //pub source: Option<String>,
    //pub rights: Option<Text>,
    //pub media: Vec<MediaObject>,
    //pub language: Option<String>,
    //pub base: Option<String>,
}

impl From<feed_rs::model::Entry> for Entry {
    fn from(value: feed_rs::model::Entry) -> Self {
        Self {
            id: value.id,
            title: value.title.map(|v| v.content),
            updated: value.updated.map(|v| v.timestamp()),
            content: value.content.map(|v| v.body.unwrap()),
            links: value.links.into_iter().map(|v| v.href).collect(),
            summary: value.summary.map(|v| v.content),
            published: value.published.map(|v| v.timestamp()),
        }
    }
}

#[tauri::command]
pub async fn fetch_feed(url: &str) -> Result<Feed, String> {
    let body = reqwest::get(url)
        .await
        .map_err(|e| e.to_string())?
        .text()
        .await
        .map_err(|e| e.to_string())?;
    let feed = feed_rs::parser::parse(body.as_bytes()).map_err(|e| e.to_string())?;

    Ok(Feed::from(feed))
}
