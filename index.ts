import * as NodeFetch from "node-fetch";

const yaleAuthToken =
  "VnVWWDZYVjlXSUNzVHJhcUVpdVNCUHBwZ3ZPakxUeXNsRU1LUHBjdTpkd3RPbE15WEtENUJ5ZW1GWHV0am55eGhrc0U3V0ZFY2p0dFcyOXRaSWNuWHlSWHFsWVBEZ1BSZE1xczF4R3VwVTlxa1o4UE5ubGlQanY5Z2hBZFFtMHpsM0h4V3dlS0ZBcGZzakpMcW1GMm1HR1lXRlpad01MRkw3MGR0bmNndQ==";

const urls = {
  auth: "https://mob.yalehomesystem.co.uk/yapi/o/token/",
  getStatus: "https://mob.yalehomesystem.co.uk/yapi/api/panel/mode/",
  setStatus: "https://mob.yalehomesystem.co.uk/yapi/api/panel/mode/",
  deviceStatus: "https://mob.yalehomesystem.co.uk/yapi/api/panel/device_status"
};

function headersWithAccessToken(accessToken: string): Headers {
  return new Headers({
    Authorization: `Bearer ${accessToken}`
  });
}

export async function getAccessToken(
  username: string,
  password: string
): Promise<string> {
  let payload = `grant_type=password&username=${encodeURIComponent(
    username
  )}&password=${encodeURIComponent(password)}`;
  let response = await fetch(urls.auth, {
    method: "POST",
    body: payload,
    headers: {
      Authorization: `Basic ${yaleAuthToken}`
    }
  });
  let json = await response.json();
  if (json.error === "invalid_grant") {
    return Promise.reject(json.error_description);
  } else {
    return json.access_token;
  }
}

export const enum AlamState {
  arm = "arm",
  home = "home",
  disarm = "disarm"
}

export async function setStatus(
  access_token: string,
  alarmstate: AlamState
): Promise<any> {
  if (!access_token || access_token.length === 0) {
    return Promise.reject(
      "Please call getAccessToken to get your access token first"
    );
  }

  if (
    alarmstate !== "arm" &&
    alarmstate !== "home" &&
    alarmstate !== "disarm"
  ) {
    return Promise.reject("Invalid mode passed to setStatus");
  }

  let response = await fetch(urls.setStatus, {
    method: "POST",
    body: `area=1&mode=${alarmstate}`,
    headers: headersWithAccessToken(access_token)
  });
  let json = await response.json();
  let setStatus = json.data.cmd_ack;
  return setStatus;
}

export async function getStatus(access_token: string): Promise<any> {
  if (!access_token || access_token.length === 0) {
    return Promise.reject(
      "Please call getAccessToken to get your access token first"
    );
  }

  let response = await fetch(urls.getStatus, {
    method: "GET",
    headers: headersWithAccessToken(access_token)
  });
  let json = await response.json();
  let alarmState = json.data[0].mode;
  return alarmState;
}

// export function getDevices(access_token: string): Promise<any> {
//   return fetch(urls.deviceStatus, {
//     method: "GET",
//     headers: headersWithAccessToken(access_token)
//   }).then(res => res.json())
//   .then(json => {
//     return json
//   })
// }
