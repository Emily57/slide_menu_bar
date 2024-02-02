tyrano.plugin.kag.menu = {
  tyrano: null,
  kag: null,
  snap: null,
  init: function () {},
  showMenu: function (call_back) {
    if (
      "none" == this.kag.layer.layer_event.css("display") &&
      1 != this.kag.stat.is_strong_stop
    )
      return !1;
    if (1 == this.kag.stat.is_wait) return !1;
    var that = this;
    this.kag.stat.is_skip = !1;
    this.kag.stat.is_auto = !1;
    this.kag.stat.is_auto_wait = !1;
    var layer_menu = this.kag.layer.getMenuLayer();
    layer_menu.empty();
    var button_clicked = !1;
    this.kag.html("menu", { novel: $.novel }, function (html_str) {
      var j_menu = $(html_str);
      layer_menu.append(j_menu);
      layer_menu.find(".menu_skip").click(function (e) {
        layer_menu.html("");
        layer_menu.hide();
        1 == that.kag.stat.visible_menu_button && $(".button_menu").show();
        that.kag.stat.is_skip = !0;
        "none" == that.kag.layer.layer_event.css("display") ||
          that.kag.ftag.nextOrder();
        e.stopPropagation();
      });
      layer_menu.find(".menu_close").click(function (e) {
        layer_menu.hide();
        1 == that.kag.stat.visible_menu_button && $(".button_menu").show();
        e.stopPropagation();
      });
      layer_menu.find(".menu_window_close").click(function (e) {
        that.kag.layer.hideMessageLayers();
        layer_menu.hide();
        1 == that.kag.stat.visible_menu_button && $(".button_menu").show();
        e.stopPropagation();
      });
      layer_menu.find(".menu_save").click(function (e) {
        if (1 != button_clicked) {
          button_clicked = !0;
          that.displaySave();
          e.stopPropagation();
        }
      });
      layer_menu.find(".menu_load").click(function (e) {
        if (1 != button_clicked) {
          button_clicked = !0;
          that.displayLoad();
          e.stopPropagation();
        }
      });
      layer_menu.find(".menu_back_title").click(function () {
        that.kag.backTitle();
      });
      $.preloadImgCallback(
        j_menu,
        function () {
          layer_menu.fadeIn(300);
          $(".button_menu").hide();
        },
        that
      );
    });
  },
  displaySave: function (cb) {
    var that = this;
    this.kag.stat.is_skip = !1;
    for (
      var array = that.getSaveData().data,
        i = (that.kag.layer.getMenuLayer(), 0);
      i < array.length;
      i++
    )
      array[i].num = i;
    this.kag.html(
      "save",
      { array_save: array, novel: $.novel },
      function (html_str) {
        var j_save = $(html_str);
        j_save.find(".save_list").css("font-family", that.kag.config.userFace);
        j_save.find(".save_display_area").each(function () {
          $(this).click(function (e) {
            var num = $(this).attr("data-num");
            that.snap = null;
            var layer_menu = that.kag.layer.getMenuLayer();
            layer_menu.hide();
            layer_menu.empty();
            1 == that.kag.stat.visible_menu_button && $(".button_menu").show();
            that.doSave(num, function () {
              "function" == typeof cb && cb();
            });
          });
        });
        j_save.find(".button_smart").hide();
        if ("pc" != $.userenv()) {
          j_save.find(".button_smart").show();
          j_save.find(".button_arrow_up").click(function () {
            var pos = j_save.find(".area_save_list").scrollTop() - 160;
            layer_menu
              .find(".area_save_list")
              .animate({ scrollTop: pos }, { queue: !1 });
          });
          j_save.find(".button_arrow_down").click(function () {
            var pos = j_save.find(".area_save_list").scrollTop() + 160;
            j_save
              .find(".area_save_list")
              .animate({ scrollTop: pos }, { queue: !1 });
          });
        }
        var layer_menu = that.kag.layer.getMenuLayer();
        that.setMenu(j_save, cb);
      }
    );
  },
  doSave: function (num, cb) {
    var array_save = this.getSaveData(),
      data = {},
      that = this;
    null == this.snap
      ? this.snapSave(this.kag.stat.current_save_str, function () {
          (data = that.snap).save_date = $.getNowDate() + "　" + $.getNowTime();
          array_save.data[num] = data;
          $.setStorage(
            that.kag.config.projectID + "_tyrano_data",
            array_save,
            that.kag.config.configSave
          );
          "function" == typeof cb && cb();
        })
      : "function" == typeof cb && cb();
  },
  setQuickSave: function () {
    var that = this,
      saveTitle = that.kag.stat.current_save_str;
    that.kag.menu.snapSave(saveTitle, function () {
      var data = that.snap;
      data.save_date = $.getNowDate() + "　" + $.getNowTime();
      $.setStorage(
        that.kag.config.projectID + "_tyrano_quick_save",
        data,
        that.kag.config.configSave
      );
    });
  },
  loadQuickSave: function () {
    var data = $.getStorage(
      this.kag.config.projectID + "_tyrano_quick_save",
      this.kag.config.configSave
    );
    if (!data) return !1;
    data = JSON.parse(data);
    this.loadGameData($.extend(!0, {}, data));
  },
  doSetAutoSave: function () {
    var data = this.snap;
    data.save_date = $.getNowDate() + "　" + $.getNowTime();
    $.setStorage(
      this.kag.config.projectID + "_tyrano_auto_save",
      data,
      this.kag.config.configSave
    );
  },
  loadAutoSave: function () {
    var data = $.getStorage(
      this.kag.config.projectID + "_tyrano_auto_save",
      this.kag.config.configSave
    );
    if (!data) return !1;
    data = JSON.parse(data);
    this.loadGameData($.extend(!0, {}, data), { auto_next: "yes" });
  },
  snapSave: function (title, call_back, flag_thumb) {
    var that = this,
      _current_order_index = that.kag.ftag.current_order_index - 1,
      _stat = $.extend(!0, {}, $.cloneObject(that.kag.stat)),
      models = (three = this.kag.tmp.three).models,
      three_save = {};
    three_save.stat = three.stat;
    three_save.evt = three.evt;
    var three = this.kag.tmp.three,
      save_models = {};
    for (var key in models) {
      var model = models[key];
      save_models[key] = model.toSaveObj();
    }
    three_save.models = save_models;
    void 0 === flag_thumb && (flag_thumb = this.kag.config.configThumbnail);
    if ("false" == flag_thumb) {
      var data = {};
      data.title = title;
      data.stat = _stat;
      data.three = three_save;
      data.current_order_index = _current_order_index;
      data.save_date = $.getNowDate() + "　" + $.getNowTime();
      data.img_data = "";
      var layer_obj = that.kag.layer.getLayeyHtml();
      data.layer = layer_obj;
      that.snap = $.extend(!0, {}, $.cloneObject(data));
      call_back && call_back();
    } else {
      $("#tyrano_base").find(".layer_blend_mode").css("display", "none");
      setTimeout(function () {
        var completeImage = function (img_code) {
          var data = {};
          data.title = title;
          data.stat = _stat;
          data.three = three_save;
          data.current_order_index = _current_order_index;
          data.save_date = $.getNowDate() + "　" + $.getNowTime();
          data.img_data = img_code;
          var layer_obj = that.kag.layer.getLayeyHtml();
          data.layer = layer_obj;
          that.snap = $.extend(!0, {}, $.cloneObject(data));
          call_back && call_back();
        };
        if ("" != that.kag.stat.save_img) {
          var img = new Image();
          img.src = _stat.save_img;
          img.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width = that.kag.config.scWidth;
            canvas.height = that.kag.config.scHeight;
            canvas.getContext("2d").drawImage(img, 0, 0);
            var img_code = that.createImgCode(canvas);
            completeImage(img_code);
          };
        } else {
          let w,
            h,
            canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d"),
            videos = document.querySelectorAll("video");
          for (let i = 0, len = videos.length; i < len; i++) {
            const v = videos[i];
            try {
              w = v.videoWidth;
              h = v.videoHeight;
              canvas.style.left = v.style.left;
              canvas.style.top = v.style.top;
              canvas.style.width = v.style.width;
              canvas.style.height = v.style.height;
              canvas.width = w;
              canvas.height = h;
              ctx.fillRect(0, 0, w, h);
              ctx.drawImage(v, 0, 0, w, h);
              v.style.backgroundImage = `url(${canvas.toDataURL()})`;
              v.style.backgroundSize = "cover";
              v.classList.add("tmp_video_canvas");
              ctx.clearRect(0, 0, w, h);
            } catch (e) {
              continue;
            }
          }
          var tmp_base = $("#tyrano_base"),
            tmp_left = tmp_base.css("left"),
            tmp_top = tmp_base.css("top"),
            tmp_trans = tmp_base.css("transform");
          tmp_base.css("left", 0);
          tmp_base.css("top", 0);
          tmp_base.css("transform", "");
          var opt = {
            height: that.kag.config.scHeight,
            width: that.kag.config.scWidth,
          };
          html2canvas(tmp_base.get(0), opt).then(function (canvas) {
            $("#tyrano_base").find(".layer_blend_mode").css("display", "");
            $("#tyrano_base")
              .find(".tmp_video_canvas")
              .css("backgroundImage", "");
            var img_code = that.createImgCode(canvas);
            completeImage(img_code);
          });
          tmp_base.hide();
          tmp_base.css("left", tmp_left);
          tmp_base.css("top", tmp_top);
          tmp_base.css("transform", tmp_trans);
          tmp_base.show();
        }
      }, 20);
    }
  },
  createImgCode: function (canvas) {
    var q = this.kag.config.configThumbnailQuality;
    return "low" == q
      ? canvas.toDataURL("image/jpeg", 0.3)
      : "middle" == q
      ? canvas.toDataURL("image/jpeg", 0.7)
      : canvas.toDataURL();
  },
  setGameSleep: function (next_flag) {
    this.kag.tmp.sleep_game_next = !!next_flag;
    this.kag.tmp.sleep_game = this.snap;
  },
  displayLoad: function (cb) {
    var that = this;
    this.kag.stat.is_skip = !1;
    for (
      var array = that.getSaveData().data,
        i = (that.kag.layer.getMenuLayer(), 0);
      i < array.length;
      i++
    )
      array[i].num = i;
    this.kag.html(
      "load",
      { array_save: array, novel: $.novel },
      function (html_str) {
        var j_save = $(html_str);
        j_save.find(".save_list").css("font-family", that.kag.config.userFace);
        j_save.find(".save_display_area").each(function () {
          $(this).click(function (e) {
            var num = $(this).attr("data-num");
            if ("" != array[num].save_date) {
              that.snap = null;
              that.loadGame(num);
              var layer_menu = that.kag.layer.getMenuLayer();
              layer_menu.hide();
              layer_menu.empty();
              1 == that.kag.stat.visible_menu_button &&
                $(".button_menu").show();
            }
          });
        });
        j_save.find(".button_smart").hide();
        if ("pc" != $.userenv()) {
          j_save.find(".button_smart").show();
          j_save.find(".button_arrow_up").click(function () {
            var pos = j_save.find(".area_save_list").scrollTop() - 160;
            layer_menu
              .find(".area_save_list")
              .animate({ scrollTop: pos }, { queue: !1 });
          });
          j_save.find(".button_arrow_down").click(function () {
            var pos = j_save.find(".area_save_list").scrollTop() + 160;
            j_save
              .find(".area_save_list")
              .animate({ scrollTop: pos }, { queue: !1 });
          });
        }
        var layer_menu = that.kag.layer.getMenuLayer();
        that.setMenu(j_save, cb);
      }
    );
  },
  loadGame: function (num) {
    var array = this.getSaveData().data;
    if ("" != array[num].save_date) {
      var auto_next = "no";
      if (1 == array[num].stat.load_auto_next) {
        array[num].stat.load_auto_next = !1;
        auto_next = "yes";
      }
      this.loadGameData($.extend(!0, {}, array[num]), { auto_next: auto_next });
    }
  },
  loadGameData: function (data, options) {
    var auto_next = "no";
    void 0 === options
      ? (options = { bgm_over: "false" })
      : void 0 === options.bgm_over && (options.bgm_over = "false");
    options.auto_next && (auto_next = options.auto_next);
    if ("undefined" != typeof Live2Dcanvas)
      for (model_id in Live2Dcanvas)
        if (Live2Dcanvas[model_id]) {
          Live2Dcanvas[model_id].check_delete = 2;
          Live2D.deleteBuffer(Live2Dcanvas[model_id].modelno);
          delete Live2Dcanvas[model_id];
        }
    this.kag.layer.setLayerHtml(data.layer);
    this.kag.stat = data.stat;
    1 == this.kag.stat.is_strong_stop
      ? (auto_next = "stop")
      : (this.kag.stat.is_strong_stop = !1);
    this.kag.setTitle(this.kag.stat.title);
    if ("false" == options.bgm_over) {
      var map_se = this.kag.tmp.map_se;
      for (var key in map_se)
        map_se[key] &&
          this.kag.ftag.startTag("stopse", { stop: "true", buf: key });
      var map_bgm = this.kag.tmp.map_bgm;
      for (var key in map_bgm)
        this.kag.ftag.startTag("stopbgm", { stop: "true", buf: key });
      if ("" != this.kag.stat.current_bgm) {
        var pm = {
          loop: "true",
          storage: this.kag.stat.current_bgm,
          html5: this.kag.stat.current_bgm_html5,
          stop: "true",
        };
        "" != this.kag.stat.current_bgm_vol &&
          (pm.volume = this.kag.stat.current_bgm_vol);
        this.kag.ftag.startTag("playbgm", pm);
      }
      for (key in this.kag.stat.current_se) {
        var pm_obj = this.kag.stat.current_se[key];
        pm_obj.stop = "true";
        this.kag.ftag.startTag("playse", pm_obj);
      }
    }
    if (this.kag.stat.cssload)
      for (file in this.kag.stat.cssload) {
        var style =
          '<link rel="stylesheet" href="' +
          file +
          "?" +
          Math.floor(1e7 * Math.random()) +
          '">';
        $("head link:last").after(style);
      }
    else this.kag.stat.cssload = {};
    this.kag.stat.current_bgmovie ||
      (this.kag.stat.current_bgmovie = { storage: "", volume: "" });
    if ("true" == this.kag.config.useCamera) {
      $(".layer_camera").css({
        "-animation-name": "",
        "-animation-duration": "",
        "-animation-play-state": "",
        "-animation-delay": "",
        "-animation-iteration-count": "",
        "-animation-direction": "",
        "-animation-fill-mode": "",
        "-animation-timing-function": "",
      });
      for (key in this.kag.stat.current_camera) {
        var a3d_define = {
          frames: {
            "0%": { trans: this.kag.stat.current_camera[key] },
            "100%": { trans: this.kag.stat.current_camera[key] },
          },
          config: { duration: "5ms", state: "running", easing: "ease" },
          complete: function () {},
        };
        if ("layer_camera" == key) {
          $(".layer_camera").css("-webkit-transform-origin", "center center");
          setTimeout(function () {
            $(".layer_camera").a3d(a3d_define);
          }, 1);
        } else {
          $("." + key + "_fore").css(
            "-webkit-transform-origin",
            "center center"
          );
          setTimeout(function () {
            $("." + key + "_fore").a3d(a3d_define);
          }, 1);
        }
      }
    }
    $(".tyrano_base").find("video").remove();
    this.kag.tmp.video_playing = !1;
    if ("" != this.kag.stat.current_bgmovie.storage) {
      pm = {
        storage: this.kag.stat.current_bgmovie.storage,
        volume: this.kag.stat.current_bgmovie.volume,
        stop: "true",
      };
      this.kag.tmp.video_playing = !1;
      this.kag.ftag.startTag("bgmovie", pm);
    }
    if ("" != this.kag.stat.current_bgcamera) {
      this.kag.stat.current_bgcamera.stop = "true";
      this.kag.ftag.startTag("bgcamera", this.kag.stat.current_bgcamera);
    }
    var three = data.three;
    if (1 == three.stat.is_load) {
      this.kag.stat.is_strong_stop = !0;
      var init_pm = three.stat.init_pm;
      this.kag.ftag.startTag("3d_close", {});
      init_pm.next = "false";
      this.kag.ftag.startTag("3d_init", init_pm);
      var models = three.models,
        scene_pm = three.stat.scene_pm;
      scene_pm.next = "false";
      this.kag.ftag.startTag("3d_scene", scene_pm);
      for (var key in models) {
        var model = models[key];
        (pm = model.pm).pos = model.pos;
        pm.rot = model.rot;
        pm.scale = model.scale;
        var tag = pm._tag;
        "camera" == key && (tag = "3d_camera");
        pm.next = "false";
        console.log("=========");
        console.log(tag);
        console.log(pm);
        this.kag.ftag.startTag(tag, pm);
      }
      var gyro = three.stat.gyro;
      if (1 == gyro.enable) {
        var gyro_pm = gyro.pm;
        gyro_pm.next = "false";
        this.kag.ftag.startTag("3d_gyro", gyro_pm);
      }
      three.stat.canvas_show
        ? this.kag.tmp.three.j_canvas.show()
        : this.kag.tmp.three.j_canvas.hide();
      this.kag.tmp.three.stat = three.stat;
      this.kag.tmp.three.evt = three.evt;
      this.kag.stat.is_strong_stop = !1;
    }
    this.kag.setCursor(this.kag.stat.current_cursor);
    1 == this.kag.stat.visible_menu_button
      ? $(".button_menu").show()
      : $(".button_menu").hide();
    $(".event-setting-element").each(function () {
      var j_elm = $(this),
        kind = j_elm.attr("data-event-tag"),
        pm = JSON.parse(j_elm.attr("data-event-pm"));
      object(tyrano.plugin.kag.tag[kind]).setEvent(j_elm, pm);
    });
    var insert = {
      name: "call",
      pm: { storage: "make.ks", auto_next: auto_next },
      val: "",
    };
    this.kag.clearTmpVariable();
    this.kag.ftag.nextOrderWithIndex(
      data.current_order_index,
      data.stat.current_scenario,
      !0,
      insert,
      "yes"
    );
  },
  setMenu: function (j_obj, cb) {
    var that = this,
      layer_menu = this.kag.layer.getMenuLayer();
    j_obj.find(".menu_close").click(function (e) {
      layer_menu.fadeOut(300, function () {
        layer_menu.empty();
        "function" == typeof cb && cb();
      });
      1 == that.kag.stat.visible_menu_button && $(".button_menu").show();
    });
    j_obj.hide();
    layer_menu.append(j_obj);
    layer_menu.show();
    $.preloadImgCallback(
      layer_menu,
      function () {
        j_obj.fadeIn(300);
        layer_menu.find(".block_menu").fadeOut(300);
      },
      that
    );
  },
  hideMenu: function () {},
  getSaveData: function () {
    var tmp_array = $.getStorage(
      this.kag.config.projectID + "_tyrano_data",
      this.kag.config.configSave
    );
    if (tmp_array) return JSON.parse(tmp_array);
    tmp_array = new Array();
    for (
      var root = { kind: "save", hash: this.kag.save_key_val },
        save_slot_num = this.kag.config.configSaveSlotNum || 5,
        i = 0;
      i < save_slot_num;
      i++
    ) {
      var json = {};
      json.title = $.lang("not_saved");
      json.current_order_index = 0;
      json.save_date = "";
      json.img_data = "";
      json.stat = {};
      tmp_array.push(json);
    }
    root.data = tmp_array;
    return root;
  },
  displayLog: function () {
    var that = this;
    this.kag.stat.is_skip = !1;
    $("<div></div>");
    this.kag.html("backlog", { novel: $.novel }, function (html_str) {
      var j_menu = $(html_str),
        layer_menu = that.kag.layer.getMenuLayer();
      layer_menu.empty();
      layer_menu.append(j_menu);
      layer_menu.find(".menu_close").click(function () {
        layer_menu.fadeOut(300, function () {
          layer_menu.empty();
        });
        1 == that.kag.stat.visible_menu_button && $(".button_menu").show();
      });
      layer_menu.find(".button_smart").hide();
      if ("pc" != $.userenv()) {
        layer_menu.find(".button_smart").show();
        layer_menu.find(".button_arrow_up").click(function () {
          var pos = layer_menu.find(".log_body").scrollTop() - 60;
          layer_menu
            .find(".log_body")
            .animate({ scrollTop: pos }, { queue: !1 });
        });
        layer_menu.find(".button_arrow_down").click(function () {
          var pos = layer_menu.find(".log_body").scrollTop() + 60;
          layer_menu
            .find(".log_body")
            .animate({ scrollTop: pos }, { queue: !1 });
        });
      }
      for (
        var log_str = "",
          array_log = that.kag.variable.tf.system.backlog,
          i = 0;
        i < array_log.length;
        i++
      )
        log_str += array_log[i] + "<br />";
      layer_menu.find(".log_body").html(log_str);
      layer_menu.find(".log_body").css("font-family", that.kag.config.userFace);
      $.preloadImgCallback(
        layer_menu,
        function () {
          layer_menu.fadeIn(300);
          layer_menu.find(".log_body").scrollTop(9999999999);
        },
        that
      );
      $(".button_menu").hide();
    });
  },
  screenFull: function () {
    var isFullScreen =
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement ||
        document.fullScreenElement ||
        !1,
      isEnableFullScreen =
        document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled ||
        !1,
      elem = document.body;
    isEnableFullScreen &&
      (elem.requestFullscreen
        ? isFullScreen
          ? document.exitFullscreen()
          : elem.requestFullscreen()
        : elem.webkitRequestFullscreen
        ? isFullScreen
          ? document.webkitExitFullscreen()
          : elem.webkitRequestFullscreen()
        : elem.mozRequestFullScreen
        ? isFullScreen
          ? document.mozCancelFullScreen()
          : elem.mozRequestFullScreen()
        : elem.msRequestFullscreen &&
          (isFullScreen
            ? document.msExitFullscreen()
            : elem.msRequestFullscreen()));
  },
  test: function () {},
  toggleMenuBar: function () {
    document.querySelectorAll(".menu_bar").forEach(function (element) {
      if (element.classList.contains("open")) {
        element.classList.remove("open");
        element.classList.add("close");
      } else {
        element.classList.remove("close");
        element.classList.add("open");
      }
    });
  },
};
