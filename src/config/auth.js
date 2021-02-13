/* eslint-disable */

const mainServer = {
    oauth_consumer_key: "p2szywibtwHNFh1RZVNq21uCo9XBuUZvEwz0sYae",
    oauth_secret:       "e2oP3FSVjFLEq3zgQylpYMVVX7QJUKcchJLh4Ksm",
    url:                "https://www.openstreetmap.org",
};

// use this when testing new features to not spoil main osm database
const devServer = {
    oauth_consumer_key: '8CxsQfI9MFfsYm4nq8bBm6Htch3SiK9BFA8IQhHs',
    oauth_secret:       'SZka3I7w1Z41ePlQDauVwLLt6UIG4LLDbaWhNHkM',
    url:                "https://master.apis.dev.openstreetmap.org"
};

const authConfig = {   
    ...mainServer,
  overpassApiUrl:     "https://overpass.kumi.systems/api/interpreter"
  //overpassApiUrl: "https://overpass.nchc.org.tw/api/interpreter"
};
export default authConfig;
