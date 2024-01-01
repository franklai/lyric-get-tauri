/* eslint func-names: 0, no-var: 0, vars-on-top:0, prefer-template: 0, prefer-arrow-callback:0 */
import lyricParser from "./lyric-parser/index.js";

function init() {
  if (!document.querySelectorAll) {
    return;
  }

  var links = document.querySelectorAll(".pure-menu-link");
  links = Array.prototype.slice.call(links);

  var $ = function (id) {
    return document.getElementById(id);
  };
  var q = function (selector) {
    return document.querySelector(selector);
  };

  var formQuery = $("query_form");
  var inputUrl = $("url");
  var btnSubmit = $("submit_btn");
  var divLoading = $("loading_div");
  var divLyric = $("lyric_div");
  var textareaLyric = $("lyric_textarea");

  var showContent = function (id) {
    var activeCls = "content-active";
    q("." + activeCls).classList.remove(activeCls);
    $(id).classList.add(activeCls);

    var selectedCls = "pure-menu-selected";
    q("." + selectedCls).classList.remove(selectedCls);
    q(".pure-menu-item[data-content-id=" + id + "]").classList.add(selectedCls);
  };
  var updateTextareaHeight = function () {
    textareaLyric.style.height = "100px";
    var height = textareaLyric.scrollHeight;
    textareaLyric.style.height = height + 20 + "px";
  };

  const showLyric = () => {
    divLoading.style.display = "none";
    divLyric.style.display = "block";
  };

  const showMessage = ({ message, isError = false }) => {
    divLoading.innerHTML = message;

    divLoading.style.display = "block";
    divLyric.style.display = "none";

    divLoading.classList.toggle("error", isError);
  };

  const showLoading = () => {
    showMessage({
      message: "Loading...",
    });
  };

  const showErrorMessage = (message) => {
    showMessage({
      message,
      isError: true,
    });
  };

  var setLoading = function () {
    showLoading();
    btnSubmit.disabled = true;
  };
  var setError = function () {
    var errMsg = "Failed to get lyric. Please contact franklai.";
    showErrorMessage(errMsg);
    btnSubmit.disabled = false;
  };
  var setResult = function (lyric) {
    if (!lyric) {
      setError();
      return;
    }

    showLyric();
    btnSubmit.disabled = false;

    textareaLyric.value = lyric;
    updateTextareaHeight(lyric);
  };

  links.forEach(function (link) {
    link.addEventListener("click", function (evt) {
      console.log("click on link");
      evt.preventDefault();
      evt.stopImmediatePropagation();
      evt.stopPropagation();

      var pn = evt.target.parentNode;
      if (!pn || !pn.dataset) {
        return;
      }

      var id = pn.dataset.contentId;
      console.log("show id:", id);
      showContent(id);
    });
  });

  var selectLyric = function () {
    textareaLyric.select();
  };
  $("select").addEventListener("click", function () {
    selectLyric();
  });
  if (
    document.queryCommandSupported &&
    document.queryCommandSupported("copy")
  ) {
    var msg = q(".copied-msg");

    $("copy").addEventListener("click", function () {
      selectLyric();
      document.execCommand("copy");

      msg.classList.add("fadeout");
    });

    msg.addEventListener("transitionend", function () {
      msg.classList.remove("fadeout");
    });
  } else {
    $("copy").disabled = true;
  }
  inputUrl.addEventListener("click", function () {
    inputUrl.select();
  });

  var doAjaxQuery = function (val) {
    var url = "app?url=" + encodeURIComponent(val);

    fetch(url)
      .then(function (resp) {
        resp
          .json()
          .then(function (json) {
            if (!json || !json.lyric) {
              setError();
              return;
            }
            setResult(json.lyric);
          })
          .catch(function () {
            setError();
          });
      })
      .catch(function () {
        setError();
      });
  };

  const getHtml = async (url) => {
    const { http } = window.__TAURI__;
    const response = await http.fetch(url, {
      responseType: http.ResponseType.Text,
    });
    return response.data;
  };

  const doLocalQuery = async (val) => {
    const lyric = await lyricParser.getFull(val, { getHtml });

    setResult(lyric);
  };

  var doQuery = async function () {
    var val = inputUrl.value.trim();
    if (val === "" || val.toLowerCase().match("https?://") === null) {
      return false;
    }

    setLoading();

    try {
      return await doLocalQuery(val);
    } catch (err) {
      console.error(err);
      setError();
    }
  };

  $("examples").addEventListener("click", async function (evt) {
    if (evt.target.tagName.toLowerCase() !== "a") {
      return;
    }
    if (evt.metaKey || evt.ctrlKey || evt.shiftKey || evt.altKey) {
      return;
    }
    evt.preventDefault();

    inputUrl.value = evt.target.href;

    showContent("main");
    await doQuery();
  });

  formQuery.addEventListener("submit", function (evt) {
    evt.preventDefault();
    doQuery();
  });
}

document.addEventListener("DOMContentLoaded", init);
