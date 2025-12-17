export default {
    async fetch(request, env) {
        const ip = env.PIP;
        const port = env.POR;
        
        const proxy = `http://${ip}:${port}`;
        const target = "http://ipinfo.io/ip";
        
        try {
            const resp = await fetch(proxy, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: `url=${encodeURIComponent(target)}`
            });
            
            const text = await resp.text();
            return new Response("代理返回内容：\n" + text);
        } catch (e) {
            return new Response("代理连接失败：" + e.toString());
        }
    }
}