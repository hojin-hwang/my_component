/* 
	ttb.form.lib.js v.0.1 2022.0124
*/
(function()
{
	if(!window.hasOwnProperty('ttb')) window.ttb = {};

	if(window.ttb.hasOwnProperty('form')) return;

	window.is_object = (v) => typeof v === "object" && v !== null;
	window.is_string = (v) => typeof v === 'string' || v instanceof String;
	window.is_function = (v) => typeof v === 'function';
	window.is_array = (v) => Array.isArray(v);
	window.is_null = (v) => v === null;

	ttb.load_js = function (url, callback, defer, crossorigin)
	{
		if(document.querySelector(`script[src="${url}"]`)) return false;

		let script = document.createElement('script');
		script.setAttribute("type", "text/javascript");
		script.setAttribute("src", url);

		if(defer) script.setAttribute("defer", true);
		if(crossorigin) script.setAttribute("crossorigin", "anonymous");
		if (callback) script.onload = callback;

		document.documentElement.append(script);
	};

	ttb.load_css = function (url)
	{
		if(document.querySelector(`link[href="${url}"]`)) return false;

		let style = document.createElement('link');
		style.setAttribute("rel", "stylesheet");
		style.setAttribute("type", "text/css");
		style.setAttribute("href", url);

		document.documentElement.append(style);
	}

	ttb.form = {};

	ttb.form.validate = function (node_form, error_callback)
	{
		const ERROR_REQUIRED = -1;
		const ERROR_MAX_LENGTH = -2;
		const ERROR_MIN_LENGTH = -3;

		function get_type_error_message(tagName, display_name)
		{
			switch ( tagName )
			{
				case "SELECT":

					return `(${display_name}) 선택은 필수입니다.`;
				break;

				case "TEXTAREA":

					return `(${display_name}) 입력은 필수입니다.`;
				break;

				default:
					return `(${display_name}) 선택은 필수입니다.`;
				break;
			}
		}

		function get_empty_message(result)
		{
			const element = result.target;

			let found_key = '';

			found_key = ['data-error-message', 'placeholder', 'title', 'alt'].find(key => element.getAttribute(key)?.length > 0);

			if(found_key) return element.getAttribute(found_key);

			found_key = ['data-display-name', 'name', 'id'].forEach(key => element.getAttribute(key)?.length > 0);

			if(found_key) return get_type_error_message(element.tagName, element.getAttribute(found_key));

			return 'noname';
		}

		function get_invalid_length_message(result)
		{
			const element = result.target;

			let found_key = '';

			found_key = ['data-error-message', 'placeholder', 'title', 'alt'].find(key => element.getAttribute(key)?.length > 0);

			if(found_key) return element.getAttribute(found_key);

			found_key = ['data-display-name', 'name', 'id'].find(key => element.getAttribute(key)?.length > 0);

			if(found_key)
			{
				if(result.minLength > 0) return `(${element.getAttribute(found_key)}) 항목은 ${result.minLength}문자 보다 길어야 합니다.`;
				else return `(${element.getAttribute(found_key)}) 항목은 ${result.maxLength}문자 이내로 해주세요.`;
			}

			if(result.minLength > 0) return `입력은 ${result.minLength}문자 이상으로 해주셔야합니다.`;
			else return `입력은 ${result.maxLength}문자 이내로 해주세요.`;
		}


		if(!error_callback)
		{
			error_callback = function (result)
			{
				if(100 !== result.code)
				{
					alert(result.message);
					result.target.focus();
				}

				return result;
			};
		}

		let result = {code: 100, message: 'OK', target: null, minLength: 0, maxLength: 0};

		Array.from(node_form.querySelectorAll('.required,[required]')).filter(ele => !ele.classList.contains('ignore-item')).find( element =>
		{
			if(0 == element.value.trim().length)
			{
				result.code = ERROR_REQUIRED;
				result.target = element;
				result.message = get_empty_message(result);

				return true;
			}

			if ('INPUT' == element.tagName)
			{
				let type = element.type;

				if (element.type?.match(/checkbox|radio/) && !element.checked)
				{
					if (0 == element.name?.length || node_form.querySelectorAll(`input[name="${element.name}"]:checked`).length < 1)
					{
						result.code = ERROR_REQUIRED;
						result.target = element;
						result.message = get_empty_message(result);

						return true;
					}
				}
			}

			let minLength = element.getAttribute('minlength');
			if (is_null(minLength)) minLength = element.dataset.minlength;

			if (minLength)
			{
				minLength = parseInt(minLength);

				if(typeof minLength != 'NaN' && minLength > 0 && element.value.trim().length < minLength)
				{
					result.code = ERROR_MIN_LENGTH;
					result.target = element;
					result.minLength = minLength;
					result.message = get_invalid_length_message(result);

					return true;
				}
			}

			let maxLength = element.getAttribute('maxlength');
			if (is_null(maxLength)) maxLength = element.dataset.maxlength;

			if (maxLength)
			{
				maxLength = parseInt(maxLength);

				if(typeof maxLength != 'NaN' && maxLength > 0 && element.value.trim().length > maxLength)
				{
					result.code = ERROR_MAX_LENGTH;
					result.target = element;
					result.maxLength = maxLength;

					result.message = get_invalid_length_message(result);

					return true;
				}
			}
		});

		return error_callback(result);
	};

})();