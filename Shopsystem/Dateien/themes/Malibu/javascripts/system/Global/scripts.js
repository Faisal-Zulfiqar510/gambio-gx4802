"use strict";

$(function () {

	// Overlay Menu Toggle

	$("[data-toggle=menu]").on("click", function () {
		if (!$("body").hasClass("show-menu")) {
			$("#meco-overlay-menu").css("display", "block");
			setTimeout(function () {
				$("body").addClass("show-menu");
			}, 50);

			if (!$("#meco-overlay-menu #categories").length) {
				$("#meco-overlay-menu").append($('#categories'));
			}

			if ($("#meco-overlay-menu #categories .navbar-categories-left").length > 1) {
				$("#meco-overlay-menu #categories .navbar-categories-left:last").remove();
			}
		} else {
			$("body").removeClass("show-menu");
			setTimeout(function () {
				$("#meco-overlay-menu").css("display", "none");
			}, 500);

			if (!$("#header #categories").length) {
				$("#header").append($('#categories'));
			}
		}
	});

	function open_cart(e) {
		e.preventDefault();
		if (!$("body").hasClass("show-cart") && $("#cart-container:visible").length < 1) {
			window.scrollTo(0, 0);
			$("#offcanvas-cart-overlay").css("display", "block");
			setTimeout(function () {
				$("body").addClass("show-cart");
			}, 50);
		} else {
			$("body").removeClass("show-cart");
			setTimeout(function () {
				$("#offcanvas-cart-overlay").css("display", "none");
			}, 500);
		}

		if (e.data.auto_close) {
			setTimeout(close_cart, 3000);
		}
	}

	function close_cart() {
		$("body").removeClass("show-cart");
		setTimeout(function () {
			$("#offcanvas-cart-overlay").css("display", "none");
		}, 500);
	}

	// Offcanvas Cart Toggle

	$("[data-toggle=cart]").on("click", { auto_close: false }, open_cart);
	$("#offcanvas-cart-overlay").on("click", close_cart);

	$('body').on("CART_DROPDOWN_OPEN", { auto_close: true }, open_cart);

	// Shopping Cart Product Count

	setTimeout(function () {
		$("body").trigger("CART_DROPDOWN_UPDATE");
	}, 1500);

	// Add special class to body element, if the visitor is using IE11
	if (!!navigator.userAgent.match(/Trident.*rv\:11\./)) {
		$("body").addClass("ie11");
	}

	// // Category Pages Left Sidebar Behavior

	// if ($("body.page-index-type-cat").length) {

	//     var $left = $("#left"),
	//        $listing = $(".category-product-listing"),
	//        $categories = $(".box-categories", $left),
	//        $filter = $(".box-filter", $left),
	//        leftIsInvisible = $left.css("display") == "none";

	//     if (leftIsInvisible && $categories.length) {

	//        var sidebarNeeded = false;

	//        // check if category menu has sub categories

	//        var $listItems = $("li", $categories),
	//            $activeListItem = $("li.active", $categories);

	//        if ($listItems.length && !$activeListItem.length) {
	//            sidebarNeeded = true;
	//        }

	//        // check if filters available


	//        // wrap product_listing
	//        $sidebar = $("<div class='category-sidebar col-md-3'></div>");
	//        $listing
	//            .addClass("row")
	//            .wrapInner("<div class='col-md-9'></div>")
	//            .prepend($sidebar);
	//        $categories.appendTo($sidebar);
	//        $filter.appendTo($sidebar);
	//     }
	// }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdsb2JhbC9zY3JpcHRzLmpzIl0sIm5hbWVzIjpbIiQiLCJvbiIsImhhc0NsYXNzIiwiY3NzIiwic2V0VGltZW91dCIsImFkZENsYXNzIiwibGVuZ3RoIiwiYXBwZW5kIiwicmVtb3ZlIiwicmVtb3ZlQ2xhc3MiLCJvcGVuX2NhcnQiLCJlIiwicHJldmVudERlZmF1bHQiLCJ3aW5kb3ciLCJzY3JvbGxUbyIsImRhdGEiLCJhdXRvX2Nsb3NlIiwiY2xvc2VfY2FydCIsInRyaWdnZXIiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJtYXRjaCJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsRUFBRSxZQUFXOztBQUdaOztBQUVBQSxHQUFFLG9CQUFGLEVBQXdCQyxFQUF4QixDQUEyQixPQUEzQixFQUFvQyxZQUFXO0FBQzlDLE1BQUksQ0FBQ0QsRUFBRSxNQUFGLEVBQVVFLFFBQVYsQ0FBbUIsV0FBbkIsQ0FBTCxFQUFzQztBQUNyQ0YsS0FBRSxvQkFBRixFQUF3QkcsR0FBeEIsQ0FBNEIsU0FBNUIsRUFBdUMsT0FBdkM7QUFDQUMsY0FBVyxZQUFXO0FBQ3JCSixNQUFFLE1BQUYsRUFBVUssUUFBVixDQUFtQixXQUFuQjtBQUNBLElBRkQsRUFFRyxFQUZIOztBQUlBLE9BQUksQ0FBQ0wsRUFBRSxnQ0FBRixFQUFvQ00sTUFBekMsRUFBaUQ7QUFDaEROLE1BQUUsb0JBQUYsRUFBd0JPLE1BQXhCLENBQStCUCxFQUFFLGFBQUYsQ0FBL0I7QUFDQTs7QUFFRCxPQUFJQSxFQUFFLHdEQUFGLEVBQTRETSxNQUE1RCxHQUFxRSxDQUF6RSxFQUE0RTtBQUMzRU4sTUFBRSw2REFBRixFQUFpRVEsTUFBakU7QUFDQTtBQUNELEdBYkQsTUFhTztBQUNOUixLQUFFLE1BQUYsRUFBVVMsV0FBVixDQUFzQixXQUF0QjtBQUNBTCxjQUFXLFlBQVc7QUFDckJKLE1BQUUsb0JBQUYsRUFBd0JHLEdBQXhCLENBQTRCLFNBQTVCLEVBQXVDLE1BQXZDO0FBQ0EsSUFGRCxFQUVHLEdBRkg7O0FBSUEsT0FBSSxDQUFDSCxFQUFFLHFCQUFGLEVBQXlCTSxNQUE5QixFQUFzQztBQUNyQ04sTUFBRSxTQUFGLEVBQWFPLE1BQWIsQ0FBb0JQLEVBQUUsYUFBRixDQUFwQjtBQUNBO0FBQ0Q7QUFDRCxFQXhCRDs7QUEwQkEsVUFBU1UsU0FBVCxDQUFtQkMsQ0FBbkIsRUFBc0I7QUFDckJBLElBQUVDLGNBQUY7QUFDQSxNQUFJLENBQUNaLEVBQUUsTUFBRixFQUFVRSxRQUFWLENBQW1CLFdBQW5CLENBQUQsSUFBb0NGLEVBQUUseUJBQUYsRUFBNkJNLE1BQTdCLEdBQXNDLENBQTlFLEVBQWlGO0FBQ2hGTyxVQUFPQyxRQUFQLENBQWdCLENBQWhCLEVBQW1CLENBQW5CO0FBQ0FkLEtBQUUseUJBQUYsRUFBNkJHLEdBQTdCLENBQWlDLFNBQWpDLEVBQTRDLE9BQTVDO0FBQ0FDLGNBQVcsWUFBVztBQUNyQkosTUFBRSxNQUFGLEVBQVVLLFFBQVYsQ0FBbUIsV0FBbkI7QUFDQSxJQUZELEVBRUcsRUFGSDtBQUdBLEdBTkQsTUFNTztBQUNOTCxLQUFFLE1BQUYsRUFBVVMsV0FBVixDQUFzQixXQUF0QjtBQUNBTCxjQUFXLFlBQVc7QUFDckJKLE1BQUUseUJBQUYsRUFBNkJHLEdBQTdCLENBQWlDLFNBQWpDLEVBQTRDLE1BQTVDO0FBQ0EsSUFGRCxFQUVHLEdBRkg7QUFHQTs7QUFFRCxNQUFJUSxFQUFFSSxJQUFGLENBQU9DLFVBQVgsRUFBdUI7QUFDdEJaLGNBQVdhLFVBQVgsRUFBdUIsSUFBdkI7QUFDQTtBQUNEOztBQUVELFVBQVNBLFVBQVQsR0FBc0I7QUFDckJqQixJQUFFLE1BQUYsRUFBVVMsV0FBVixDQUFzQixXQUF0QjtBQUNBTCxhQUFXLFlBQVc7QUFDckJKLEtBQUUseUJBQUYsRUFBNkJHLEdBQTdCLENBQWlDLFNBQWpDLEVBQTRDLE1BQTVDO0FBQ0EsR0FGRCxFQUVHLEdBRkg7QUFHQTs7QUFHRDs7QUFFQUgsR0FBRSxvQkFBRixFQUF3QkMsRUFBeEIsQ0FBMkIsT0FBM0IsRUFBb0MsRUFBQ2UsWUFBWSxLQUFiLEVBQXBDLEVBQXlETixTQUF6RDtBQUNBVixHQUFFLHlCQUFGLEVBQTZCQyxFQUE3QixDQUFnQyxPQUFoQyxFQUF5Q2dCLFVBQXpDOztBQUVBakIsR0FBRSxNQUFGLEVBQVVDLEVBQVYsQ0FBYSxvQkFBYixFQUFtQyxFQUFDZSxZQUFZLElBQWIsRUFBbkMsRUFBdUROLFNBQXZEOztBQUVBOztBQUVBTixZQUFXLFlBQVc7QUFDckJKLElBQUUsTUFBRixFQUFVa0IsT0FBVixDQUFrQixzQkFBbEI7QUFDQSxFQUZELEVBRUcsSUFGSDs7QUFJQTtBQUNBLEtBQUksQ0FBQyxDQUFDQyxVQUFVQyxTQUFWLENBQW9CQyxLQUFwQixDQUEwQixtQkFBMUIsQ0FBTixFQUFzRDtBQUNyRHJCLElBQUUsTUFBRixFQUFVSyxRQUFWLENBQW1CLE1BQW5CO0FBQ0E7O0FBR0Q7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQWxIRCIsImZpbGUiOiJHbG9iYWwvc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiQoZnVuY3Rpb24oKSB7XG5cdFxuXHRcblx0Ly8gT3ZlcmxheSBNZW51IFRvZ2dsZVxuXHRcblx0JChcIltkYXRhLXRvZ2dsZT1tZW51XVwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXHRcdGlmICghJChcImJvZHlcIikuaGFzQ2xhc3MoXCJzaG93LW1lbnVcIikpIHtcblx0XHRcdCQoXCIjbWVjby1vdmVybGF5LW1lbnVcIikuY3NzKFwiZGlzcGxheVwiLCBcImJsb2NrXCIpO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJzaG93LW1lbnVcIik7XG5cdFx0XHR9LCA1MCk7XG5cdFx0XHRcblx0XHRcdGlmICghJChcIiNtZWNvLW92ZXJsYXktbWVudSAjY2F0ZWdvcmllc1wiKS5sZW5ndGgpIHtcblx0XHRcdFx0JChcIiNtZWNvLW92ZXJsYXktbWVudVwiKS5hcHBlbmQoJCgnI2NhdGVnb3JpZXMnKSk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmICgkKFwiI21lY28tb3ZlcmxheS1tZW51ICNjYXRlZ29yaWVzIC5uYXZiYXItY2F0ZWdvcmllcy1sZWZ0XCIpLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0JChcIiNtZWNvLW92ZXJsYXktbWVudSAjY2F0ZWdvcmllcyAubmF2YmFyLWNhdGVnb3JpZXMtbGVmdDpsYXN0XCIpLnJlbW92ZSgpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHQkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcInNob3ctbWVudVwiKTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoXCIjbWVjby1vdmVybGF5LW1lbnVcIikuY3NzKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG5cdFx0XHR9LCA1MDApO1xuXHRcdFx0XG5cdFx0XHRpZiAoISQoXCIjaGVhZGVyICNjYXRlZ29yaWVzXCIpLmxlbmd0aCkge1xuXHRcdFx0XHQkKFwiI2hlYWRlclwiKS5hcHBlbmQoJCgnI2NhdGVnb3JpZXMnKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblx0XG5cdGZ1bmN0aW9uIG9wZW5fY2FydChlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGlmICghJChcImJvZHlcIikuaGFzQ2xhc3MoXCJzaG93LWNhcnRcIikgJiYgJChcIiNjYXJ0LWNvbnRhaW5lcjp2aXNpYmxlXCIpLmxlbmd0aCA8IDEpIHtcblx0XHRcdHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcblx0XHRcdCQoXCIjb2ZmY2FudmFzLWNhcnQtb3ZlcmxheVwiKS5jc3MoXCJkaXNwbGF5XCIsIFwiYmxvY2tcIik7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcInNob3ctY2FydFwiKTtcblx0XHRcdH0sIDUwKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJzaG93LWNhcnRcIik7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKFwiI29mZmNhbnZhcy1jYXJ0LW92ZXJsYXlcIikuY3NzKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG5cdFx0XHR9LCA1MDApO1xuXHRcdH1cblx0XHRcblx0XHRpZiAoZS5kYXRhLmF1dG9fY2xvc2UpIHtcblx0XHRcdHNldFRpbWVvdXQoY2xvc2VfY2FydCwgMzAwMCk7XG5cdFx0fVxuXHR9XG5cdFxuXHRmdW5jdGlvbiBjbG9zZV9jYXJ0KCkge1xuXHRcdCQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwic2hvdy1jYXJ0XCIpO1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHQkKFwiI29mZmNhbnZhcy1jYXJ0LW92ZXJsYXlcIikuY3NzKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG5cdFx0fSwgNTAwKTtcblx0fVxuXHRcblx0XG5cdC8vIE9mZmNhbnZhcyBDYXJ0IFRvZ2dsZVxuXHRcblx0JChcIltkYXRhLXRvZ2dsZT1jYXJ0XVwiKS5vbihcImNsaWNrXCIsIHthdXRvX2Nsb3NlOiBmYWxzZX0sIG9wZW5fY2FydCk7XG5cdCQoXCIjb2ZmY2FudmFzLWNhcnQtb3ZlcmxheVwiKS5vbihcImNsaWNrXCIsIGNsb3NlX2NhcnQpO1xuXHRcblx0JCgnYm9keScpLm9uKFwiQ0FSVF9EUk9QRE9XTl9PUEVOXCIsIHthdXRvX2Nsb3NlOiB0cnVlfSwgb3Blbl9jYXJ0KTtcblx0XG5cdC8vIFNob3BwaW5nIENhcnQgUHJvZHVjdCBDb3VudFxuXHRcblx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHQkKFwiYm9keVwiKS50cmlnZ2VyKFwiQ0FSVF9EUk9QRE9XTl9VUERBVEVcIik7XG5cdH0sIDE1MDApO1xuXHRcblx0Ly8gQWRkIHNwZWNpYWwgY2xhc3MgdG8gYm9keSBlbGVtZW50LCBpZiB0aGUgdmlzaXRvciBpcyB1c2luZyBJRTExXG5cdGlmICghIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1RyaWRlbnQuKnJ2XFw6MTFcXC4vKSkge1xuXHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiaWUxMVwiKTtcblx0fVxuXHRcblx0XG5cdC8vIC8vIENhdGVnb3J5IFBhZ2VzIExlZnQgU2lkZWJhciBCZWhhdmlvclxuXHRcblx0Ly8gaWYgKCQoXCJib2R5LnBhZ2UtaW5kZXgtdHlwZS1jYXRcIikubGVuZ3RoKSB7XG5cdFxuXHQvLyAgICAgdmFyICRsZWZ0ID0gJChcIiNsZWZ0XCIpLFxuXHQvLyAgICAgICAgJGxpc3RpbmcgPSAkKFwiLmNhdGVnb3J5LXByb2R1Y3QtbGlzdGluZ1wiKSxcblx0Ly8gICAgICAgICRjYXRlZ29yaWVzID0gJChcIi5ib3gtY2F0ZWdvcmllc1wiLCAkbGVmdCksXG5cdC8vICAgICAgICAkZmlsdGVyID0gJChcIi5ib3gtZmlsdGVyXCIsICRsZWZ0KSxcblx0Ly8gICAgICAgIGxlZnRJc0ludmlzaWJsZSA9ICRsZWZ0LmNzcyhcImRpc3BsYXlcIikgPT0gXCJub25lXCI7XG5cdFxuXHQvLyAgICAgaWYgKGxlZnRJc0ludmlzaWJsZSAmJiAkY2F0ZWdvcmllcy5sZW5ndGgpIHtcblx0XG5cdC8vICAgICAgICB2YXIgc2lkZWJhck5lZWRlZCA9IGZhbHNlO1xuXHRcblx0Ly8gICAgICAgIC8vIGNoZWNrIGlmIGNhdGVnb3J5IG1lbnUgaGFzIHN1YiBjYXRlZ29yaWVzXG5cdFxuXHQvLyAgICAgICAgdmFyICRsaXN0SXRlbXMgPSAkKFwibGlcIiwgJGNhdGVnb3JpZXMpLFxuXHQvLyAgICAgICAgICAgICRhY3RpdmVMaXN0SXRlbSA9ICQoXCJsaS5hY3RpdmVcIiwgJGNhdGVnb3JpZXMpO1xuXHRcblx0Ly8gICAgICAgIGlmICgkbGlzdEl0ZW1zLmxlbmd0aCAmJiAhJGFjdGl2ZUxpc3RJdGVtLmxlbmd0aCkge1xuXHQvLyAgICAgICAgICAgIHNpZGViYXJOZWVkZWQgPSB0cnVlO1xuXHQvLyAgICAgICAgfVxuXHRcblx0Ly8gICAgICAgIC8vIGNoZWNrIGlmIGZpbHRlcnMgYXZhaWxhYmxlXG5cdFxuXHRcblx0Ly8gICAgICAgIC8vIHdyYXAgcHJvZHVjdF9saXN0aW5nXG5cdC8vICAgICAgICAkc2lkZWJhciA9ICQoXCI8ZGl2IGNsYXNzPSdjYXRlZ29yeS1zaWRlYmFyIGNvbC1tZC0zJz48L2Rpdj5cIik7XG5cdC8vICAgICAgICAkbGlzdGluZ1xuXHQvLyAgICAgICAgICAgIC5hZGRDbGFzcyhcInJvd1wiKVxuXHQvLyAgICAgICAgICAgIC53cmFwSW5uZXIoXCI8ZGl2IGNsYXNzPSdjb2wtbWQtOSc+PC9kaXY+XCIpXG5cdC8vICAgICAgICAgICAgLnByZXBlbmQoJHNpZGViYXIpO1xuXHQvLyAgICAgICAgJGNhdGVnb3JpZXMuYXBwZW5kVG8oJHNpZGViYXIpO1xuXHQvLyAgICAgICAgJGZpbHRlci5hcHBlbmRUbygkc2lkZWJhcik7XG5cdC8vICAgICB9XG5cdC8vIH1cbn0pOyJdfQ==
