/* eslint-disable */

const prodServer = {
    client_id: "M8nzCZPZGnlJoSrGAMbzsGXXZYtMPg_eyoyEjCyCydo",
    client_secret:       "SdRMd2ReOVMO0VeWVdNuhY0hyYgbbLwMGAusMnO47Hs",
    url:                "https://www.openstreetmap.org",
    redirect_uri: 'https://localize.osm.tracestrack.com/land.html',
    apiUrl: 'https://api.openstreetmap.org',
    scope: 'openid write_api read_prefs',
    auto: true // Enable automatic OAuth 2.0
};

// use this when testing new features to not spoil main osm database

const devServer = {
    client_id: "j_AG2do_-ig3P3CtYMwLN0tsXum2Bs3JrAtVErwZN3w",
    client_secret:       "EbyaqsZlpQON1ci5curWKX4mA6j_iHTzH73v2g5Htto",
    url:                "https://www.openstreetmap.org",
    redirect_uri: 'http://dev-server:3000/land.html',
    apiUrl: 'https://api.openstreetmap.org',
    scope: 'openid write_api read_prefs',
    auto: true // Enable automatic OAuth 2.0
};

const mainServer = prodServer;

// Development mode - skip authentication for local testing
// Set to true to bypass login and use mock user data
const DEV_MODE = process.env.REACT_APP_DEV_MODE === 'true';

// Mock user data for development mode
const mockUser = {
    id: 999999,
    display_name: "Dev User",
    account_created: "2024-01-01T00:00:00Z",
    description: "Development mode user",
    contributor_terms: { agreed: true },
    img: { href: "" },
    roles: [],
    changesets: { count: 0 },
    traces: { count: 0 },
    blocks: { received: { count: 0, active: 0 } },
    languages: ["en"]
};

const authConfig = {
    ...mainServer,
    overpassApiUrl: "https://overpass.kumi.systems/api/interpreter",
    //overpassApiUrl: "https://overpass.nchc.org.tw/api/interpreter"
    devMode: DEV_MODE,
    mockUser
};
export default authConfig;
