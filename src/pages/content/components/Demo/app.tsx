const footer = document.getElementsByClassName("srf-layout__footer")[0];
const sidebar = document.getElementsByClassName("srf-layout__sidebar")[0];

const toggleFooter = () => {
  if (footer.style.display === "none") {
    footer.style.display = "block";
    chrome.storage.local.set({ hideFooter: false });
  } else {
    footer.style.display = "none";
    chrome.storage.local.set({ hideFooter: true });
  }
};

const toggleSidebar = () => {
  if (sidebar.style.display === "none") {
    sidebar.style.display = "block";
    chrome.storage.local.set({ hideSidebar: false });
  } else {
    sidebar.style.display = "none";
    chrome.storage.local.set({ hideSidebar: true });
  }
};

async function init() {
  const values = await chrome.storage.local.get(["hideFooter", "hideSidebar"]);

  console.log(values);

  footer.style.display = values.hideFooter ? "none" : "block";
  sidebar.style.display = values.hideSidebar ? "none" : "block";
}

export default function App() {
  init();
  return (
    <>
      {/* <div className="content-view text-lime-400">content view</div> */}
      <div
        style={{
          position: "fixed",
          zIndex: 9999,
          top: 8,
          right: 8,
          width: 200,
          height: 100,
          background: "white",
          border: "1px solid #aaa",
          borderRadius: 8,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <button onClick={toggleFooter}>Hide footer</button>
        <button onClick={toggleSidebar}>Hide left menu</button>
      </div>
    </>
  );
}
