export default {
    async fetch(request) {
        if (request.method === "POST") {
            const form = await request.formData();
            const ip = form.get("ip") || "";
            const port = form.get("port") || "";
            
            const proxy = `http://${ip}:${port}`;
            const target = "http://ipinfo.io/ip";
            
            let result = "";
            
            try {
                // 关键：HTTP 代理必须用完整 URL
                const resp = await fetch(target, {
                    method: "GET",
                    headers: {
                        "Host": "ipinfo.io"
                    },
                    // Worker 的代理方式
                    cf: {
                        // 通过代理转发
                        fetch: proxy
                    }
                });
                
                result = await resp.text();
            } catch (e) {
                result = "代理连接失败：" + e.toString();
            }
            
            return new Response(renderPage(ip, port, result), {
                headers: { "Content-Type": "text/html; charset=utf-8" }
            });
        }
        
        return new Response(renderPage("", "", ""), {
            headers: { "Content-Type": "text/html; charset=utf-8" }
        });
    }
};

function renderPage(ip, port, output) {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>HTTP 代理测试工具</title>
<style>
  body { font-family: sans-serif; padding: 20px; }
  input { width: 200px; padding: 6px; margin: 5px 0; }
  textarea { width: 100%; height: 150px; margin-top: 10px; font-family: monospace; }
  button { padding: 10px 20px; margin-top: 10px; }
</style>
</head>
<body>

<h2>HTTP 代理测试工具（Worker 版）</h2>

<form method="POST">
  <label>代理 IP：</label><br>
  <input name="ip" value="${ip}" placeholder="例如：18.216.120.75"><br>

  <label>代理端口：</label><br>
  <input name="port" value="${port}" placeholder="例如：3000"><br>

  <button type="submit">测试代理</button>
</form>

<h3>测试结果：</h3>
<textarea readonly>${escapeHtml(output)}</textarea>

</body>
</html>
`;
}

function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}