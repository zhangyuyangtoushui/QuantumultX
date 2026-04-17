/******************************
脚本功能：通用签到（适配所有NewAPI源码搭建的中转站）- Loon 适配版
更新时间：2026-04-17
*******************************/

const HEADER_KEY_PREFIX = "UniversalCheckin_Headers";
const HOSTS_LIST_KEY = "UniversalCheckin_HostsList";
const isGetHeader = typeof $request !== "undefined";

const NEED_KEYS = [
  "Host", "User-Agent", "Accept", "Accept-Language", "Accept-Encoding",
  "Origin", "Referer", "Cookie", "new-api-user",
];

function safeJsonParse(str) {
  try { return JSON.parse(str); } catch (_) { return null; }
}

// 适配 Loon 的存储
const storage = {
  read: (key) => $persistentStore.read(key),
  write: (val, key) => $persistentStore.write(val, key)
};

function getSavedHosts() {
  const raw = storage.read(HOSTS_LIST_KEY);
  if (!raw) return [];
  const hosts = safeJsonParse(raw) || [];
  return Array.isArray(hosts) ? hosts.filter(h => h && typeof h === "string") : [];
}

function addHostToList(host) {
  const hosts = getSavedHosts();
  if (!hosts.includes(host)) {
    hosts.push(host);
    storage.write(JSON.stringify(hosts), HOSTS_LIST_KEY);
  }
}

function pickNeedHeaders(src = {}) {
  const dst = {};
  const lowerMap = {};
  for (const k of Object.keys(src || {})) lowerMap[k.toLowerCase()] = src[k];
  for (const k of NEED_KEYS) {
    const v = src[k] ?? lowerMap[k.toLowerCase()];
    if (v !== undefined) dst[k] = v;
  }
  return dst;
}

function notifyTitleForHost(host) {
  try {
    let name = host.replace(/^www\./, "").split(".")[0];
    name = name.replace(/[-_]api$|[-_]service$|^api[-_]/i, "");
    return name.charAt(0).toUpperCase() + name.slice(1) || host;
  } catch (_) { return host; }
}

if (isGetHeader) {
  // --- 抓包逻辑 ---
  const host = $request.headers.Host || $request.headers.host;
  const picked = pickNeedHeaders($request.headers);

  if (!host || !picked.Cookie || !picked["new-api-user"]) {
    $done({});
  } else {
    const key = `${HEADER_KEY_PREFIX}:${host}`;
    const ok = storage.write(JSON.stringify(picked), key);
    if (ok) addHostToList(host);
    const title = notifyTitleForHost(host);
    $notification.post(`${title} 参数获取成功`, "", "后续将自动签到");
    $done({});
  }
} else {
  // --- 签到逻辑 ---
  const hostsToRun = getSavedHosts();
  if (hostsToRun.length === 0) {
    $notification.post("NewAPI签到", "无可用站点", "请先开启重写并访问站点控制面板抓包");
    $done();
  }

  const doCheckin = (host) => {
    return new Promise((resolve) => {
      const key = `${HEADER_KEY_PREFIX}:${host}`;
      const savedHeaders = safeJsonParse(storage.read(key));
      if (!savedHeaders) return resolve();

      const options = {
        url: `https://${host}/api/user/checkin`,
        headers: {
          ...savedHeaders,
          "User-Agent": savedHeaders["User-Agent"] || "Loon/3.0"
        }
      };

      $httpClient.post(options, (err, resp, body) => {
        const title = notifyTitleForHost(host);
        if (err) {
          console.log(`[${title}] 错误: ${err}`);
          resolve();
        } else {
          const obj = safeJsonParse(body) || {};
          if (obj.success) {
            $notification.post(title, "签到成功", `奖励: ${obj.data?.quota_awarded || "未知"}`);
          } else {
            $notification.post(title, "签到失败", obj.message || "未知原因");
          }
          resolve();
        }
      });
    });
  };

  (async () => {
    for (const h of hostsToRun) await doCheckin(h);
    $done();
  })();
}
