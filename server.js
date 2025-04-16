const express = require("express");
const app = express();

app.use(express.static("public"));

app.get("/events", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();

  const events = [
    { event: "start", data: "41" },
    {
      event: "doing",
      data: JSON.stringify({
        path: "/snap/firmware-updater/167/bin/launch-firmware-updater.sh",
        name: "launch-firmware-updater.sh",
        size: 67,
        mtime: 1738871373000,
        ctime: 1738871373000,
      }),
    },
    {
      event: "doing",
      data: JSON.stringify({
        path: "/usr/src/linux-hwe-6.11-headers-6.11.0-21/kernel/gen_kheaders.sh",
        name: "gen_kheaders.sh",
        size: 3203,
        mtime: 1726412276000,
        ctime: 1743230065000,
      }),
    },
    {
      event: "doing",
      data: JSON.stringify({
        path: "/etc/rc2.d/S01console-setup.sh",
        name: "S01console-setup.sh",
        size: 26,
        mtime: 1739606976000,
        ctime: 1743229752000,
      }),
    },
    {
      event: "doing",
      data: JSON.stringify({
        path: "/home/cano/go/pkg/mod/golang.org/x/sys@v0.22.0/unix/mkall.sh",
        name: "mkall.sh",
        size: 8304,
        mtime: 1743385115000,
        ctime: 1743385115000,
      }),
    },
    {
      event: "doing",
      data: JSON.stringify({
        path: "/home/cano/go/pkg/mod/golang.org/x/sys@v0.22.0/unix/mkerrors.sh",
        name: "mkerrors.sh",
        size: 20652,
        mtime: 1743385115000,
        ctime: 1743385115000,
      }),
    },
    {
      event: "doing",
      data: JSON.stringify({
        path: "/usr/share/libdebuginfod-common/debuginfod.sh",
        name: "debuginfod.sh",
        size: 596,
        mtime: 1742227438000,
        ctime: 1743230275000,
      }),
    },
    {
      event: "doing",
      data: JSON.stringify({
        path: "/snap/snapd/23545/etc/profile.d/apps-bin-path.sh",
        name: "apps-bin-path.sh",
        size: 835,
        mtime: 1733303620000,
        ctime: 1733303620000,
      }),
    },
    {
      event: "doing",
      data: JSON.stringify({
        path: "/snap/snapd/23771/usr/lib/snapd/complete.sh",
        name: "complete.sh",
        size: 5394,
        mtime: 1737103779000,
        ctime: 1737103779000,
      }),
    },
    { event: "end", data: "" },
  ];

  let i = 0;
  const sendEvent = () => {
    if (i >= events.length) {
      res.write(`event: end\ndata: \n\n`);
      return res.end();
    }

    const event = events[i++];
    res.write(`event: ${event.event}\ndata: ${event.data}\n\n`);
    setTimeout(sendEvent, 1000); // 每秒发送一个事件
  };

  sendEvent();
});

app.listen(3000, () => {
  console.log("服务器运行于：http://localhost:3000");
});
