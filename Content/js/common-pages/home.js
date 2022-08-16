"use strict";
$(document).ready(function () {
  let Mp3Player = {
    init: function () {
      this.renderElement();
  
      this.cssHtml();
  
      this.handleEventDOM();
  
      this.handleWithPluin();
  
      this.definePropertises();
  
      this.loadCurrentSong(1);
  
      this.handleMp3Event();
    },
    renderElement: function () {
      // render my playlist
      this.renderMyPlayListSongs();
  
      // render personal artists
      this.renderPersonalArtists();
  
      // render layout theme
      this.renderLayoutTheme();
  
      // render personaL Playlist
      this.renderPersonalPlaylist();
  
      // render maybe you care playlist
      this.renderMaybeYouCarePlaylist();
    },
    cssHtml: function () {
      // set height for left side bar
      this.setInnerHeightForSideBar();
  
      // set width for search header
      this.setWidthForHeaderWidthSearch();
    },
    handleEventDOM: function () {
      // display content of tab pane
      this.displayContentOfTabPane();
  
      // sticky header with search when scroll down
      this.stickyHeaderWithSearch();
  
      // play list song when click library play btn
      this.playListSong();
  
      // active list song playing button
      this.activeListSongPlaying();
  
      // open layout container modal
      this.openLayoutContainerModal();
  
      // get data theme and set theme background
      this.getDataTheme();
  
      // open playlist in playlist track
      this.openPlaylistInPlaylistTrack();
  
      // change main content when click tap side bar
      this.swapTapSideBar();
    },
    handleWithPluin: function () {
      // slick
      this.UsingSlickSliderPlugin();
    },
    UsingSlickSliderPlugin: function () {
      $("#render-artist").slick({
        slidesToShow: 5,
        autoplay: false,
        autoplaySpeed: 3000,
        variableWidth: false,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              infinite: true,
              variableWidth: false,
            }
          },
          {
            breakpoint: 414,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              infinite: true,
              variableWidth: false,
            }
          },
        ]
      });

      $("#render-playlist").slick({
        slidesToShow: 4,
        autoplay: false,
        autoplaySpeed: 3000,
        variableWidth: false,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              infinite: true,
              variableWidth: false,
            }
          },
          {
            breakpoint: 414,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              infinite: true,
              variableWidth: false,
            }
          },
        ]
      });
  
      $(".container-default .slick-next.slick-arrow").addClass("position-absolute");
      $(".container-default .slick-prev.slick-arrow").addClass("position-absolute");
      
    },
    currentPlaylistIndex: 1,
    currentIndex: 0,
    isPlaying: false,
    isRepeat: false,
    isRandom: false,
    isMuted: false,
    handleMp3Event: function () {
      let _this = this;
  
      // play / pause song
      $("#play-btn")
        .unbind()
        .click(function (e) {
          e.preventDefault();
          $(".song__icon-playing").addClass("d-none");
          $(".song__icon-pause").addClass("d-none");
  
          if (_this.isPlaying) {
            _this.isPlaying = false;
            _this.pauseSong();
          } else {
            _this.isPlaying = true;
            _this.playSong();
          }
        });
  
      // play/pause song when click play button in track cd thumb
      $("#track__cd-playBtn").unbind().click(function(e) {
        _this.isPlaying = true;
        _this.playSong();
      });
      $("#track__cd-pauseBtn").unbind().click(function (e) {
        _this.isPlaying = false;
        $('.song__icon-playing').addClass("d-none");
        _this.pauseSong();
      });

      $("#track__controls-play").unbind().click(function (e) {
        if(_this.isPlaying) {
          _this.isPlaying = false;
          _this.pauseSong();
        } else {
          _this.isPlaying = true;
          _this.playSong();
        }
      });
  
      // next / prev song
      $("#next-song")
        .unbind()
        .click(function (e) {
          _this.isPlaying = true;
          $(".song__icon-playing").addClass("d-none");
          $(".song__icon-pause").addClass("d-none");
  
          if (_this.isRandom) {
            _this.playRandomSong();
            _this.playSong();
          } else {
            _this.currentIndex++;
            _this.loadCurrentSong(_this.currentPlaylistIndex);
            _this.playSong();
          }
        });
      $("#prev-song")
        .unbind()
        .click(function (e) {
          _this.currentIndex--;
          _this.loadCurrentSong(_this.currentPlaylistIndex);
          _this.removePlayingIcon();
          _this.playSong();
        });
  
      // random song
      $("#random-song")
        .unbind()
        .click(function (e) {
          if (_this.isRandom) {
            _this.isRandom = false;
            $(this).toggleClass("active");
          } else {
            _this.isRandom = true;
            $(this).toggleClass("active");
          }
        });
  
      // repeat song
      $("#repeat-song")
        .unbind()
        .click(function (e) {
          if (_this.isRepeat) {
            _this.isRepeat = false;
            $(this).toggleClass("active");
          } else {
            _this.isRepeat = true;
            $(this).toggleClass("active");
          }
        });
  
      // current time of song
      $("#audio")[0].ontimeupdate = function (e) {
        let currentTime = this.currentTime;
        let duration = this.duration;
        let percentSong = Math.floor((currentTime / duration) * 100);
  
        $(".time-start p").html(String(currentTime).toMMSS());
        $("#range").css({
          background: `linear-gradient(to right,
            var(--progressbar-active-bg) 0%,
            var(--progressbar-active-bg) ${percentSong}%,
            var(--progressbar-player-bg) ${percentSong}%,
            var(--progressbar-player-bg) 100%)`,
        });
        $("#range").val(percentSong);
      };
  
      $("#audio")[0].onloadedmetadata = function (e) {
        let currentTime = this.currentTime;
        let duration = this.duration;
        let percentSong = Math.floor((currentTime / duration) * 100);
  
        $("#range").css({
          background: `linear-gradient(to right,
             var(--progressbar-active-bg) 0%,
            var(--progressbar-active-bg) ${percentSong}%,
             var(--progressbar-player-bg) ${percentSong}%,
              var(--progressbar-player-bg) 100%)`,
        });
        $("#range").val(percentSong);
  
        $("#volumn").css({
          background: `linear-gradient(to right,
             var(--progressbar-active-bg) 0%,
              var(--progressbar-active-bg) ${Number(this.volume * 100)}%,
               var(--progressbar-player-bg) ${Number(this.volume * 100)}%,
                var(--progressbar-player-bg) 100%)`,
        });
      };
  
      // seek song
      $("#range")
        .unbind()
        .change(function (e) {
          _this.isPlaying = true;
          let seekTime = $(this).val();
          let currentTime =
            (Number(seekTime) * Number($("#audio")[0].duration)) / 100;
  
          $("#audio")[0].currentTime = currentTime;
          _this.playSong();
        });
  
      // next song when song ended
      $("#audio")[0].onended = function (e) {
        
        if (_this.isRandom) {
          _this.playRandomSong();
          $(".song__icon-pause").addClass("d-none");
          let $playingIcon = $(".song.active").find(".song__icon-playing");
          $playingIcon.removeClass("d-none");
        }
  
        if (_this.isRepeat) {
          _this.playSong();
        }
  
        if ((_this.isRandom && _this.isRepeat) == false) {
          _this.currentIndex++;
          _this.loadCurrentSong(_this.currentPlaylistIndex);
          $(".song__icon-playing").addClass("d-none");
          _this.playSong();
        }
      };
  
      // play song when click the playlist
      $(".song")
        .unbind()
        .click(function (e) {
          e.stopPropagation();
  
          let $this = $(this);
          let dataIndex = $this.data("index");
          let $playingIcon = $this.find(".song__icon-playing");
          let $dataPlaylist = $this.data("playlist");
          
          _this.removePlayingIcon();
          _this.isPlaying = true;
          _this.currentIndex = dataIndex;
          _this.currentPlaylistIndex = $dataPlaylist;
          _this.loadCurrentSong(_this.currentPlaylistIndex);
          _this.handleMp3Event();
  
          $(".song__icon-playing").addClass("d-none");
          $this.addClass("active");
          $playingIcon.removeClass("d-none");
          _this.playSong();
        });
  
        // stop play when click current song
        $('.song.active').unbind().click(function (e) {
          if (_this.isPlaying) {
            _this.isPlaying = false;
            $(".song__icon-playing").addClass("d-none");
            _this.pauseSong();
          } else {
            _this.isPlaying = true;
            _this.playSong();
          }
        });
  
      // handle volumn of Song
      $("#volumn")
        .unbind()
        .change(function (e) {
          $("#audio")[0].volume = Number($(this).val()) / 100;
          $(this).css({
            background: `linear-gradient(to right,
               var(--progressbar-active-bg) 0%,
                var(--progressbar-active-bg) ${Number($(this).val())}%,
                 var(--progressbar-player-bg) ${Number($(this).val())}%,
                  var(--progressbar-player-bg) 100%)`,
          });
        });
  
      // mute volume when click the icon volume
      $(".volume-btn")
        .unbind()
        .click(function (e) {
          if (_this.isMuted) {
            _this.isMuted = false;
            $("#volume-mute").addClass("d-none");
            $("#volume-on").removeClass("d-none");
            $("#audio")[0].volume = Number($("#volumn").val() / 100);
          } else {
            _this.isMuted = true;
            $("#volume-mute").removeClass("d-none");
            $("#volume-on").addClass("d-none");
            $("#audio")[0].volume = 0;
          }
        });
    },
  
    // defineProp
    definePropertises: function () {
      Object.defineProperty(this, "currentPlaylist", {
        get: function () {
          return Home.PlaylistSong;
        },
      });
    },
  
    // render
    renderMyPlayListSongs: function () {
      let songs = Home.PlaylistSong[1].map((song, index) => {
        return `
          <div class="song row no-gutters padt8 padb8 align-items-center" data-index="${index}" data-playlist="1">
            <div class="col-lg-6 col-sm-6">
                <div class="row no-gutters align-items-center">
                    <div class="col-lg-1 col-sm-1 ">
                        <i class="bi bi-music-note-beamed ml8 fz-14 song__icon-note"></i>
                    </div>
                    <div class="col-lg-1 col-sm-1 position-relative">
                        <img class="song__img" src="${song.image}" alt="">
                        <div class="song__icon position-absolute d-flex">
                            <img src="../Content/image/Icon/icon-playing.gif" class="song__icon-playing playing d-none">
                            <i class="bi bi-play-fill fz-20 ml10 mt8 song__icon-pause d-none text-white"></i>
                        </div>
                    </div>
                    <div class="col-lg-1 col-sm-1"></div>
                    <div class="col-lg-9 col-sm-9">
                        <div class="d-flex flex-column">
                            <h3 id="song__name" class="fz-14 fz-sm-10">
                                ${song.name}
                            </h3>
                            <p id="song__author" class="fz-12 fz-sm-10">
                                ${song.author} 
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 col-sm-6">
                <div class="row align-items-center">
                    <div class="col-lg-9 col-sm-9">
                        <h3 id="song__album" class="fz-12 lh-40 fz-sm-10 lh-sm-0">
                            ${song.album}
                        </h3>
                    </div>
                    <div class="col-lg-3 col-sm-3 text-center">
                        <h3 id="song__duration" class="fz-12 lh-40 fz-sm-10 lh-sm-0">
                            ${song.duration}
                        </h3>
                    </div>
                </div>
            </div>
    
        </div>
          `;
      });
  
      $("#my-playlist").html(songs.join(""));
    },
    renderPersonalArtists: function () {
      let artists = Home.PersonalArtists.map((artist) => {
        return `
          <div class=" artist__card">
                                                 <div class="artist__avatar">
                                                     <img src="${artist.image}" alt="">
                                                  </div>
                                                  <a href="#" class="artist__name d-block fz-14 text-center mt16 mb4 position-relative">
                                                    ${artist.name}
                                                    <div class="artist__desc pad16 position-absolute text-left">
                                                      <div class="artist__desc-info align-items-center d-flex justify-content-between mb16">
                                                          <div class="artist__desc-div d-flex align-items-center">
                                                              <div class="artist__desc-avatar">
                                                                  <img with="48" height="48" src="${artist.image}" alt="">
                                                              </div>
                                                              <div class="artist__desc-name ml12">
                                                                  <h3 class="fz-14 fw-600 medium cursor-pointer">${artist.name}</h3>
                                                                  <p class="artist__desc-like fz-12 fw-600">${artist.like}</p>
                                                              </div>
                                                          </div>
                                                          <div class="artist__desc-div">
                                                              <button class="play-thisArtist-Songs d-flex align-items-center">
                                                                  <i class="bi bi-shuffle fz-14"></i>
                                                                  <h3 class="fz-12 ml8">GÓC NHẠC</h3>
                                                              </button>
                                                          </div>
                                                      </div>
                                                      <p class="artist__desc-story mb16 fz-12 fw-400">
                                                        ${artist.desc}
                                                      </p>
                                                      <div class="artist__desc-newProduct">
                                                          <h3 class="fz-14 mb8 fw-600">Mới nhất</h3>
                                                          <div class="row">
                                                              <div class="col-lg-3">
                                                                  <div class="artist__desc-productImg">
                                                                      <img src="${artist.newProduct[1].product}" alt="" class="artist__desc-product cursor-pointer">
                                                                  </div>
                                                                  <h3 class="fz-12 mt8 cursor-pointer text-center">${artist.newProduct[1].name}</h3>
                                                              </div>
                                                              <div class="col-lg-3">
                                                                  <div class="artist__desc-productImg">
                                                                      <img src="${artist.newProduct[2].product}" alt="" class="artist__desc-product cursor-pointer">
                                                                  </div>
                                                                  <h3 class="fz-12 mt8 cursor-pointer text-center">${artist.newProduct[2].name}</h3>
                                                              </div>
                                                              <div class="col-lg-3">
                                                                  <div class="artist__desc-productImg">
                                                                      <img src="${artist.newProduct[3].product}" alt="" class="artist__desc-product cursor-pointer">
                                                                  </div>
                                                                  <h3 class="fz-12 mt8 cursor-pointer text-center">${artist.newProduct[3].name}</h3>
                                                              </div>
                                                              <div class="col-lg-3">
                                                                  <div class="artist__desc-productImg">
                                                                      <img src="${artist.newProduct[4].product}" alt="" class="artist__desc-product cursor-pointer">
                                                                  </div>
                                                                  <h3 class="fz-12 mt8 cursor-pointer text-center">${artist.newProduct[4].name}</h3>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </div>
                                                  </a>
                                                  
                                             </div>
          `;
      });
  
      $("#render-artist").html(artists.join(""));
    },
    renderLayoutTheme: function () {
      let artists = Home.ArtistLayoutTheme.map((artist) => {
        return ` 
          <div class="col-lg-2-4 layout__content-parent">
              <div class="layout__content-div position-relative">
                  <img src="${artist.image}" alt="" class="layout__content-img">
                  <div class="layout__content-overlay justify-content-center padl24 padr24 flex-column position-absolute">
                      <button data-theme="${artist.dataTheme}" class="layout__content-useTheme fz-8 padt4 padb4 mb8">
                          ÁP DỤNG
                      </button>
                      <button class="layout__content-check fz-8 padt4 padb4">
                          XEM TRƯỚC
                      </button>
                  </div>
              </div>
              <h3 class="layout__content-name">
                  ${artist.name}
              </h3>
          </div>
          `;
      });
  
      let topics = Home.TopicLayoutTheme.map((topic) => {
        return `
        <div class="col-lg-2-4 layout__content-parent">
        <div class="layout__content-div position-relative">
            <img src="${topic.image}" alt="" class="layout__content-img">
            <div class="layout__content-overlay justify-content-center padl24 padr24 flex-column position-absolute">
                <button data-theme="${topic.dataTheme}" class="layout__content-useTheme fz-8 padt4 padb4 mb8">
                    ÁP DỤNG
                </button>
                <button class="layout__content-check fz-8 padt4 padb4">
                    XEM TRƯỚC
                </button>
            </div>
        </div>
        <h3 class="layout__content-name">
            ${topic.name}
        </h3>
    </div>
        `;
      });
  
      $(".layout__content-artist").html(artists.join(""));
      $(".layout__content-topic").html(topics.join(""));
    },
    renderPersonalPlaylist: function () {
      let playlists = Home.PersonalPlaylist.map((playlist) => {
        return `
        <div class="playlist__card" data-playlist="${playlist.dataPlaylist}">
            <div class="playlist__div position-relative">
                <img src="${playlist.image}" alt="" class="playlist__div-img">
                <div class="playlist__div playlist__div-icon position-absolute ">
                    <div class="playlist__div-actions d-flex align-items-center position-absolute">
                        <i class="bi bi-heart fz-20 cursor-pointer"></i>
                        <div class="playlist__div-rounded text-center">
                            <img with="18" height="18" class="mt16 d-none" src="../Content/image/Icon/icon-playing.gif" alt="">
                            <i class="bi bi-play-fill fz-36"></i>
                        </div>
                        <i class="bi bi-three-dots fz-20"></i>                                                   
                    </div>
                </div>
            </div>
            <div class="playlist__div-content">
                <h3 class="playlist__div-name mt8 mb4 fz-14 cursor-pointer fw-600">
                    ${playlist.name}
                </h3>
                <p class="playlist__div-author fz-12">
                    ${playlist.author}
                </p>
            </div>
        </div>
        `;
      });
  
      $("#render-playlist").html(playlists.join(""));
    },
    renderPlaylistToTrack: function (playlist) {
      let songs = Home.PlaylistSong[playlist].map((song, index) => {
        return `
        <div class="song row no-gutters padt8 padb8" data-index="${index}" data-playlist="${song.dataPlaylist}">
          <div class="col-lg-6 col-sm-6">
              <div class="row no-gutters align-items-center">
                  <div class="col-lg-1 col-sm-1">
                      <i class="bi bi-music-note-beamed ml8 fz-14 song__icon-note"></i>
                  </div>
                  <div class="col-lg-2 col-sm-2 position-relative">
                      <img class="song__img" src="${song.image}" alt="">
                      <div class="song__icon position-absolute d-flex">
                          <img src="../Content/image/Icon/icon-playing.gif" class="song__icon-playing playing d-none">
                          <i class="bi bi-play-fill fz-20 song__icon-pause text-white d-none"></i>
                      </div>
                  </div>
                  <div class="col-lg-9 col-sm-9">
                      <div class="d-flex flex-column">
                          <h3 id="song__name" class="fz-14">
                              ${song.name}
                          </h3>
                          <p id="song__author" class="fz-12">
                              ${song.author}
                          </p>
                      </div>
                  </div>
              </div>
          </div>
          <div class="col-lg-6 col-sm-6">
              <div class="row align-items-center">
                  <div class="col-lg-9 col-sm-9">
                      <p id="song__album" class="fz-12 lh-40">
                          ${song.album}
                      </p>
                  </div>
                  <div class="col-lg-3 col-sm-3 text-center">
                      <h3 id="song__duration" class="fz-12 lh-40">
                          ${song.duration}
                      </h3>
                  </div>
              </div>
          </div>
      </div>
        `;
      });
  
      $("#render-track").html(songs.join(""));
    },
    renderMaybeYouCarePlaylist: function() {
      let playlists = Home.MaybeYouCareAboutList.map((playlist) => {
        return `
        <div class="playlist__card col" data-playlist="${playlist.dataPlaylist}">
            <div class="playlist__div position-relative">
                <img src="${playlist.image}" alt="" class="playlist__div-img">
                <div class="playlist__div playlist__div-icon position-absolute ">
                    <div class="playlist__div-actions d-flex align-items-center position-absolute">
                        <i class="bi bi-heart fz-20 cursor-pointer"></i>
                        <div class="playlist__div-rounded text-center">
                            <img with="18" height="18" class="mt16 d-none" src="../Content/image/Icon/icon-playing.gif" alt="">
                            <i class="bi bi-play-fill fz-36"></i>
                        </div>
                        <i class="bi bi-three-dots fz-20"></i>                                                   
                    </div>
                </div>
            </div>
            <div class="playlist__div-content">
                <h3 class="playlist__div-name mt8 mb4 fz-14 cursor-pointer fw-600">
                    ${playlist.name}
                </h3>
                <p class="playlist__div-author fz-12">
                    ${playlist.author}
                </p>
            </div>
        </div>
        `;
      });
  
      $("#carePlaylist").html(playlists.join(""));
    },
  
    // function
    getDataTheme: function () {
      $(".layout__content-useTheme")
        .unbind()
        .click(function (e) {
          let $theme = $(this).data("theme");
          let htmlTag = $("html")[0];
          let containerBackground = $(".container-default");
          let bg = {
            Artist: {
              IU: "../Content/image/Background/iu-wall.jpg",
              Jack: "../Content/image/Background/jack-wall.jpg",
              Jennie: "../Content/image/Background/jennie-wall.jpg",
              Jisoo: "../Content/image/Background/jisoo-wall.jpg",
              Rose: "../Content/image/Background/rose-wall.jpg",
            },
            Topic: {
              ZMA: "../Content/image/Background/zma.svg",
              London: "../Content/image/Background/london.jpg",
              Eiffel: "../Content/image/Background/eiffel.jpg",
            },
          };
  
          if ($theme === "blueZMA") {
            $("html").attr("data-theme", "blue");
            $(".container__player").addClass("zma-player");
  
            let styles = Home.CssRootTheme.map((item) => {
              return item.BlueTheme.ZMA;
            });
  
            htmlTag.style = styles.join("");
            $(containerBackground).css({
              "background-image": `url(${bg.Topic.ZMA})`,
            });
          } else if ($theme === "darkEiffel") {
            $(".container__player").removeClass("zma-player");
            $("html").attr("data-theme", "dark");
  
            let styles = Home.CssRootTheme.map((item) => {
              return item.DarkTheme;
            });
  
            htmlTag.style = styles.join("");
            $(containerBackground).css({
              "background-image": `url(${bg.Topic.Eiffel})`,
            });
          } else if ($theme === "blueLondon") {
            $(".container__player").removeClass("zma-player");
            $("html").attr("data-theme", "blue");
  
            let styles = Home.CssRootTheme.map((item) => {
              return item.BlueTheme.London;
            });
  
            htmlTag.style = styles.join("");
            $(containerBackground).css({
              "background-image": `url(${bg.Topic.London})`,
            });
          } else if ($theme === "grayIU") {
            $(".container__player").removeClass("zma-player");
            $("html").attr("data-theme", "gray");
  
            let styles = Home.CssRootTheme.map((item) => {
              return item.GrayTheme.IU;
            });
  
            htmlTag.style = styles.join("");
            $(containerBackground).css({
              "background-image": `url(${bg.Artist.IU})`,
            });
          } else if ($theme === "grayJennie") {
            $("html").attr("data-theme", "gray");
  
            let styles = Home.CssRootTheme.map((item) => {
              return item.GrayTheme.Jennie;
            });
  
            htmlTag.style = styles.join("");
            $(containerBackground).css({
              "background-image": `url(${bg.Artist.Jennie})`,
            });
          } else if ($theme === "lightJisoo") {
            $("html").attr("data-theme", "light");
            $(".container__player").removeClass("zma-player");
  
            let styles = Home.CssRootTheme.map((item) => {
              return item.LightTheme.Jisoo;
            });
  
            htmlTag.style = styles.join("");
            $(containerBackground).css({
              "background-image": `url(${bg.Artist.Jisoo})`,
            });
          } else if ($theme === "blueRose") {
            $("html").attr("data-theme", "blue");
            $(".container__player").removeClass("zma-player");
  
            let styles = Home.CssRootTheme.map((item) => {
              return item.BlueTheme.Rose;
            });
  
            htmlTag.style = styles.join("");
            $(containerBackground).css({
              "background-image": `url(${bg.Artist.Rose})`,
            });
          } else if ($theme === "brownJack") {
            $("html").attr("data-theme", "brown");
            $(".container__player").removeClass("zma-player");
  
            let styles = Home.CssRootTheme.map((item) => {
              return item.BrownTheme;
            });
  
            htmlTag.style = styles.join("");
            $(containerBackground).css({
              "background-image": `url(${bg.Artist.Jack})`,
            });
          }
  
          $(".modal-layout__container").removeClass("open");
        });
    },
    playRandomSong: function () {
      let _this = this;
      let newCurrentIndex = Math.floor(
        Math.random() * Home.PlaylistSong[_this.currentPlaylistIndex].length
      );
      this.currentIndex = newCurrentIndex;
      this.isPlaying = true;
      this.loadCurrentSong(_this.currentPlaylistIndex);
      $("#audio")[0].play();
      $("#play-btn__play").addClass("d-none");
      $("#play-btn__pause").removeClass("d-none");
    },
    loadCurrentSong: function (playlist) {
  
      $(".song").removeClass("active");
  
      $(`.song[data-playlist="${this.currentPlaylistIndex}"]`)[
        this.currentIndex
      ].classList.add("active");
  
      $("#player__img").attr(
        "src",
        `${Mp3Player.currentPlaylist[playlist][this.currentIndex].image}`
      );
      $(".player__desc-name h3").html(
        `${Mp3Player.currentPlaylist[playlist][this.currentIndex].name}`
      );
      $(".player__desc-name #author").html(
        `${Mp3Player.currentPlaylist[playlist][this.currentIndex].author}`
      );
      $("#audio").attr(
        "src",
        `${Mp3Player.currentPlaylist[playlist][this.currentIndex].source}`
      );
      $(".time-end p").html(
        `${Mp3Player.currentPlaylist[playlist][this.currentIndex].duration}`
      );
    },
    playListSong: function () {
      let _this = this;
      $(".library__heading-runPlaylist")
        .unbind()
        .click(function (e) {
          _this.renderPlaylistToTrack(1);
          _this.loadCurrentSong(1);
          _this.handleMp3Event();
          _this.isPlaying = true;
  
          $(".song")[0].classList.add("active");
          $(".container__right-content.active").removeClass("active");
          $(".container__right-track").addClass("active");
          $("#container__left .ul-list .list-item.active").removeClass("active");
  
          $("#play-btn__play").addClass("d-none");
          $("#play-btn__pause").removeClass("d-none");
          $("#my-playlist").html("");
          $("#audio")[0].play();
        });
    },
    setInnerHeightForSideBar: function () {
      let height = window.innerHeight;
      let playerContainer = document.querySelector(".container__player").offsetHeight ;
      setTimeout(function () {
        let createPlaylistOffsetTop = $("#create-playlist").offset().top;
        let navSidebar2OffsetTop = $("#nav-sidebar-2").offset().top;
        let navSidebar2Height = (createPlaylistOffsetTop - navSidebar2OffsetTop) + "px";
        $("#nav-sidebar-2").css({
          "max-height": `${navSidebar2Height}`,
        });
      }, 100);
      let countedHeight = (height - playerContainer) + "px";
  
      $("#container__left").css({
        "max-height": `${countedHeight}`,
      });
      $(".container__right").css({
        "max-height": `${countedHeight}`,
      });
    },
    setWidthForHeaderWidthSearch: function () {
      let containerLeft = $("#container__left")[0].offsetWidth + "px";
  
      $("#header__with-search").css({
        "margin-left": `${containerLeft}`,
      });
    },
    displayContentOfTabPane: function () {
      $(".nav-link-border-bottom")
        .unbind()
        .click(function (e) {
          let $this = $(this);
          let $parent = $this.closest(".nav-item");
  
          $(".nav-item").removeClass("active");
          $parent.addClass("active");
        });
    },
    stickyHeaderWithSearch: function () {
      $(".container__right")[0].onscroll = function (e) {
        let scrollTop = $(this).scrollTop();
        if (scrollTop > 10) {
          $("#container__right-header").addClass("is-sticky");
        } else {
          $("#container__right-header").removeClass("is-sticky");
        }
      };
    },
    activeListSongPlaying: function () {
      $("#playlist-running")
        .unbind()
        .click(function (e) {
          $(this).toggleClass("active");
        });
    },
    openLayoutContainerModal: function () {
      $("#layout__container")
        .unbind()
        .click(function (e) {
          e.stopPropagation();
          $(".modal-layout__container").addClass("open");
        });
  
      $(document).on("click", ".wrapper", function (e) {
        $(".modal-layout__container").removeClass("open");
      });
  
      $(".modal-layout__container .modal__body")
        .unbind()
        .click(function (e) {
          e.stopPropagation();
        });
  
      $("#layout__exit")
        .unbind()
        .click(function (e) {
          $(".modal-layout__container").removeClass("open");
        });
    },
    openPlaylistInPlaylistTrack: function () {
      
      let _this = this;
      $(".playlist__card")
        .unbind()
        .click(function (e) {
          debugger
          let $this = $(this);
          let $dataPlaylist = $this.data("playlist");
          let $img = $this.find(".playlist__div-img");
          let $sourceImg = $img.attr("src");
          let $namePlaylist = $this.find(".playlist__div-name").text();
  
          _this.renderPlaylistToTrack($dataPlaylist);
          _this.handleMp3Event();
          
          $(".container__right-content.active").removeClass("active");
          $(".container__right-track").addClass("active");
          $("#track-cdThumb").attr("src", `${$sourceImg}`);
          $("#container__left .ul-list .list-item.active").removeClass("active");
          $(".track__name h3").html($namePlaylist);
        });
  
      $("#player__img")
        .unbind()
        .click(function (e) {
          $("#my-playlist").html("");
          $(".container__right-content.active").removeClass("active");
          $(".container__right-track").addClass("active");
          $(".container__right-content.active").removeClass("active");
          $(".container__right-track").addClass("active");
          $("#container__left .ul-list .list-item.active").removeClass("active");
        });
    },
    swapTapSideBar: function () {
      let _this = this;
      $(".tap-sideBar")
        .unbind()
        .click(function (e) {
          $(".tap-sideBar").removeClass("active");
          $(".container__right-content").removeClass("active");
          $(this).addClass("active");
  
          let tapPersonal = document.querySelector(".tab-personal.active");
          let tapExplore = document.querySelector(".tap-explore.active");
          let tapRanking = document.querySelector(".tap-ranking.active");
          let tapRadio = document.querySelector(".tap-radio.active");
          let tapFollow = document.querySelector(".tap-follow.active");
  
          if (tapPersonal) {
            $(".container__right-personal").addClass("active");
            _this.renderMyPlayListSongs();
            _this.handleMp3Event();
          }
        });
    },
    playSong: function () {
      let activeSong = $(".song.active");
  
            $("#play-btn__play").addClass("d-none");
            $("#play-btn__pause").removeClass("d-none");
            $('.track__cd').addClass("is-playing");
            $("#audio")[0].play();
  
            let $playingIcon = $(activeSong).find(".song__icon-playing");
            let $pauseIcon = $(activeSong).find('.song__icon-pause');
            $playingIcon.removeClass("d-none");
            $pauseIcon.addClass("d-none")
  
            $('.track__cd').removeClass("is-rollback");
            $('.track__cd').addClass("is-animated");
            $(".track__controls-play").addClass("d-none");
            $(".track__controls-pause").removeClass("d-none");
      $("#track__controls-desc").html("TẠM DỪNG");
  
    },
    pauseSong: function() {
      let activeSong = $(".song.active");
  
      $("#play-btn__play").removeClass("d-none");
      $("#play-btn__pause").addClass("d-none");
      $('.track__cd').removeClass("is-playing");
      $("#audio")[0].pause();
  
      let $pauseIcon = $(activeSong).find(".song__icon-pause");
      $pauseIcon.removeClass("d-none");
  
      $('.track__cd').addClass("is-rollback");
      $('.track__cd').removeClass("is-animated");
      $(".track__controls-play").removeClass("d-none");
      $(".track__controls-pause").addClass("d-none");
      $("#track__controls-desc").html("TIẾP TỤC PHÁT");
      setTimeout(function () {
        $('.track__cd').removeClass("is-rollback");
      }, 500)
    },
    removePlayingIcon: function() {
      $(".song__icon-pause").addClass("d-none");
      $(".song__icon-playing").addClass("d-none");
    },
  };

  Mp3Player.init();  
});

