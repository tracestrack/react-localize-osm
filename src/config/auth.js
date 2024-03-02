/* eslint-disable */

const mainServer = {
    client_id: "M8nzCZPZGnlJoSrGAMbzsGXXZYtMPg_eyoyEjCyCydo",
    client_secret:       "SdRMd2ReOVMO0VeWVdNuhY0hyYgbbLwMGAusMnO47Hs ",
    url:                "https://www.openstreetmap.org",
    redirect_uri: 'https://localize.osm.tracestrack.com/land.html',
    apiUrl: 'https://api.openstreetmap.org',
    scope: 'openid write_api read_prefs',
    auto: true
};

// use this when testing new features to not spoil main osm database
const devServer = {
    client_id: 'M8nzCZPZGnlJoSrGAMbzsGXXZYtMPg_eyoyEjCyCydo',
    client_secret:       'SdRMd2ReOVMO0VeWVdNuhY0hyYgbbLwMGAusMnO47Hs',
    url:                "https://master.apis.dev.openstreetmap.org",
    redirect_uri: 'http://127.0.0.1:8080/land.html',
    apiUrl: 'https://api.openstreetmap.org',
};

const authConfig = {   
    ...mainServer,
  overpassApiUrl:     "https://overpass.kumi.systems/api/interpreter"
  //overpassApiUrl: "https://overpass.nchc.org.tw/api/interpreter"
};
export default authConfig;
