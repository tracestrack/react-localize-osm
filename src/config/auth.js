/* eslint-disable */

const prodServer = {
    client_id: "M8nzCZPZGnlJoSrGAMbzsGXXZYtMPg_eyoyEjCyCydo",
    client_secret:       "SdRMd2ReOVMO0VeWVdNuhY0hyYgbbLwMGAusMnO47Hs",
    url:                "https://www.openstreetmap.org",
    redirect_uri: 'https://localize.osm.tracestrack.com/land.html',
    apiUrl: 'https://api.openstreetmap.org',
    scope: 'openid write_api read_prefs',
};

// use this when testing new features to not spoil main osm database

const devServer = {
    client_id: "j_AG2do_-ig3P3CtYMwLN0tsXum2Bs3JrAtVErwZN3w",
    client_secret:       "EbyaqsZlpQON1ci5curWKX4mA6j_iHTzH73v2g5Htto",
    url:                "https://www.openstreetmap.org",
    redirect_uri: 'http://127.0.0.1:3000/land.html',
    apiUrl: 'https://api.openstreetmap.org',
    scope: 'openid write_api read_prefs',
};

const mainServer = prodServer;

const authConfig = {   
    ...mainServer,
  overpassApiUrl:     "https://overpass.kumi.systems/api/interpreter"
  //overpassApiUrl: "https://overpass.nchc.org.tw/api/interpreter"
};
export default authConfig;
