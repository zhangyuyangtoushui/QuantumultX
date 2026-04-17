/******************************
脚本功能：通用签到（Loon 增强版）
更新时间：2026-04-17
*******************************/

// --- 兼容性 & 参数读取 ---
const isLoon = typeof $loon !== "undefined";
const $storage = {
  read: (key) => isLoon ? $persistentStore.read(key) : $prefs.valueForKey(key),
  write: (val, key) => isLoon ? $persistentStore.write(val, key) : $prefs.setValueForKey(val, key)
};

// 获取 Loon 插件界面的参数
const args = (typeof $argument !== "undefined" && isLoon) ? $argument : {};
const rewriteEnabled = args.capture_cookie !== false; // 默认为 true

const HEADER_KEY_PREFIX = "UniversalCheckin_Headers";
const HOSTS_LIST_KEY = "UniversalCheckin_HostsList";
const isGetHeader = typeof $request !== "undefined";

function safeJsonParse(str) { try { return JSON.parse(str); } catch (_) { return null; } }

function getSavedHosts() {
  const raw = $storage.read(HOSTS_LIST_KEY);
  if (!raw) return [];
  return safeJsonParse(raw) || [];
}

function addHostToList(host) {
  const hosts = getSavedHosts();
  if (!hosts.includes(host)) {
    hosts.push(host);
    $storage.write(JSON.stringify(hosts), HOSTS_LIST_KEY);
  }
}

// --- 逻辑开始 ---
if (isGetHeader) {
  // 如果在插件 UI 里关闭了抓包开关，直接跳过
  if (!rewriteEnabled) {
    $done({});
  } else {
    const allHeaders = $request.headers || {};
    const host = allHeaders.Host || allHeaders.host;
    const cookie = allHeaders.Cookie || allHeaders.cookie;
    const user = allHeaders["new-api-user"];

    if (host && cookie && user) {
      const picked = {
        "Host": host,
        "Cookie": cookie,
        "new-api-user": user,
        "User-Agent": allHeaders["User-Agent"] || "Loon/3.0"
      };
      if ($storage.write(JSON.stringify(picked), `${HEADER_KEY_PREFIX}:${host}`)) {
        addHostToList(host);
        $notification.post("NewAPI 凭据获取成功", host, "现在可以关闭抓包开关或等待定时签到。");
      }
    }
    $done({});
  }
} else {
  // 定时任务逻辑
  (async () => {
    const hosts = getSavedHosts();
    if (hosts.length === 0) {
      $notification.post("NewAPI 签到", "失败", "没有找到已保存的站点，请先开启抓包开关并访问面板。");
      $done();
      return;
    }

    for (const host of hosts) {
      const saved = safeJsonParse($storage.read(`${HEADER_KEY_PREFIX}:${host}`));
      if (!saved) continue;

      const options = {
        url: `https://${host}/api/user/checkin`,
        method: "POST",
        headers: saved
      };

      $httpClient.post(options, (err, resp, body) => {
        const obj = safeJsonParse(body) || {};
        if (obj.success) {
          $notification.post(host, "签到成功", `获得奖励: ${obj.data?.quota_awarded || "完成"}`);
        } else {
          console.log(`[${host}] 签到详情: ${body}`);
        }
      });
    }
    // 注意：Loon 的异步循环建议稍微等待或在回调中 done
    setTimeout(() => { $done(); }, 3000);
  })();
}
