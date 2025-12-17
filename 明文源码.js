export default {
    async fetch(request) {
        const url = new URL(request.url);
        
        // 如果是 POST，则执行混淆
        if (request.method === "POST") {
            const form = await request.formData();
            const code = form.get("code") || "";
            
            const obfuscated = obfuscate(code);
            
            return new Response(renderPage(code, obfuscated), {
                headers: { "Content-Type": "text/html; charset=utf-8" }
            });
        }
        
        // 默认显示空页面
        return new Response(renderPage("", ""), {
            headers: { "Content-Type": "text/html; charset=utf-8" }
        });
    }
};

// ------------------ 混淆逻辑（可增强） ------------------

function obfuscate(js) {
    if (!js.trim()) return "";
    
    // 简单变量混淆
    js = js.replace(/\b([a-zA-Z_]\w*)\b/g, () => {
        return "_" + Math.random().toString(36).substring(2, 10);
    });
    
    // 字符串 base64
    js = js.replace(/"([^"]*)"/g, (m, s) => `"${btoa(s)}"`);
    
    // 整体编码
    const encoded = js
        .split("")
        .map((c) => c.charCodeAt(0))
        .join(",");
    
    return `eval(String.fromCharCode(${encoded}))`;
}

// ------------------ 网页模板 ------------------

function renderPage(input, output) {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>在线 JS 混淆器</title>
<style>
  body { font-family: sans-serif; padding: 20px; }
  textarea { width: 100%; height: 200px; font-family: monospace; }
  button { padding: 10px 20px; margin-top: 10px; }
</style>
</head>
<body>

<h2>在线 JavaScript 混淆器（Worker 版）</h2>

<form method="POST">
  <h3>输入代码：</h3>
  <textarea name="code">${escapeHtml(input)}</textarea>
  <br>
  <button type="submit">混淆</button>
</form>

<h3>混淆结果：</h3>
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