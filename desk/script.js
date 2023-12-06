var toCopy = document.getElementById('to-copy'),
  btnCopy = document.getElementById('copy'),
  divInfo = document.getElementById('info');

btnCopy.addEventListener('click', function () {
  toCopy.select();

  if (document.execCommand('copy')) {
    btnCopy.classList.add('copied');

    var temp = setInterval(function () {
      btnCopy.classList.remove('copied');
      clearInterval(temp);
    }, 600);

  } else {
    console.info('document.execCommand went wrong…')
  }

  return false;
});

var url = window.location.href.slice(window.location.href.indexOf('/desk/')).slice(7);
toCopy.value = url;

function ajax(options) {
  options = options || {};
  options.type = (options.type || "GET").toUpperCase();
  options.dataType = options.dataType || "json";
  options.async = options.async || true;
  options.postMethod = options.postMethod || "form";
  options.headers = options.headers || {};
  var params = getParams(options.data);
  var xhr;
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      var status = xhr.status;
      if (status >= 200 && status < 300) {
        options.success && options.success(xhr.responseText, xhr.responseXML);
      } else {
        options.fail && options.fail(status);
      }
    }
  };
  if (options.type == "GET") {
    xhr.open("GET", options.url + "?" + params, options.async);
    xhr.send(null);
  } else if (options.type == "POST") {
    xhr.open("POST", options.url, options.async);
    if (options.postMethod == "form") {
      xhr.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded"
      );
      xhr.send(params);
    } else if (options.postMethod == "json") {
      xhr.setRequestHeader("Content-Type", "application/json");
      for (let h in options.headers) {
        xhr.setRequestHeader(h, options.headers[h]);
      }
      xhr.send(JSON.stringify(options.data));
    }
  }
}

function getParams(data) {
  var arr = [];
  for (var param in data) {
    arr.push(
      encodeURIComponent(param) + "=" + encodeURIComponent(data[param])
    );
  }
  return arr.join("&");
}

ajax({
  url: "data.json",
  type: "GET",
  dataType: "json",
  async: true,
  success: async function (response, xml) {
    let message = JSON.parse(response);
    console.log(message[url]);
    divInfo.innerHTML += "<ul>";
    for (var k in message[url]) {
      divInfo.innerHTML += '<li><a target="_blank" href="' + message[url][k] + '"> ' + k + '</a></li>';
      console.log(k);
    }
    divInfo.innerHTML += "</ul>";
  },
  fail: function (status) {
    alert("状态码为" + status);
  },
});
