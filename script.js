const state = { step: 1, name: "", email: "", topics: new Set([]) };

// https://emailregex.com/#google_vignette
const emailRegex =
	/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

// helper and dispatch functions

/**
 * Returns if input username is valid.
 *
 * @param {string} name username
 * @returns {boolean} true if non empty username else false
 */
function validateName(name) {
	return name?.trim().length !== 0;
}

/**
 * Returns if input email is valid.
 *
 * @param {string} email user email
 * @returns {boolean} true if valid email else false
 */
function validateEmail(email) {
	return email?.trim().length !== 0 && email.match(emailRegex);
}

/**
 * Returns if selected atleast one topic.
 *
 * @param {Set<string>} topics set of selected topics
 * @returns {boolean} true if topics is not empty
 */
function validateTopics(topics) {
	console.log(topics);
	console.log(JSON.stringify(state));
	return topics !== null && topics.size !== 0;
}

function capitalize(word) {
	const arr = word.split("-");
	let cursor = 0;
	for (const item of arr) {
		arr[cursor++] = item[0].toUpperCase() + item.substr(1);
	}

	return arr.join(" ");
}

// Event listeners

document
	.getElementById("name")
	.addEventListener(
		"change",
		(event) => (state.name = event.currentTarget.value)
	);

document
	.getElementById("email")
	.addEventListener(
		"change",
		(event) => (state.email = event.currentTarget.value)
	);

document.getElementById("continue-btn").addEventListener("click", (e) => {
	switch (state.step) {
		case 1:
			if (!validateName(state.name)) {
				state.name = "";
				// TODO: Change with better UX
				alert("Name field cannot be empty");
				return;
			}

			if (!validateEmail(state.email)) {
				state.email = "";
				// TODO: Change with better UX
				alert("Invalid email");
				return;
			}

			state.step = 2;

			document
				.getElementById("registration-form-step-1-header")
				.classList.add("display-none");
			document
				.getElementById("registration-form-step-2-header")
				.classList.remove("display-none");
			document
				.getElementById("registration-form-input-name")
				.classList.add("display-none");
			document
				.getElementById("registration-form-input-email")
				.classList.add("display-none");
			document
				.getElementById("registration-form-input-topic")
				.classList.remove("display-none");

			const step1Element = document.getElementById("step-1");
			step1Element.classList.remove("current");
			step1Element.classList.add("done");

			document.getElementById("step-2").classList.add("current");
			document.getElementById(
				"step-count"
			).textContent = `Step ${state.step} of 3`;
			break;
		case 2:
			if (!validateTopics(state.topics)) {
				// TODO: Better UX
				alert("Choose atleast one topic");
				return;
			}

			state.step = 3;

			document
				.getElementById("registration-form-step-2-header")
				.classList.add("display-none");
			document
				.getElementById("registration-form-step-3-header")
				.classList.remove("display-none");
			document
				.getElementById("registration-form-input-topic")
				.classList.add("display-none");
			document
				.getElementById("registration-form-summary")
				.classList.remove("display-none");
			document.getElementById("summary-name").textContent = state.name;
			document.getElementById("summary-email").textContent = state.email;

			const ul = document.getElementById("topics-list");
			state.topics.forEach((topic) => {
				const li = document.createElement("li");
				li.textContent = capitalize(topic);
				ul.appendChild(li);
			});

			document.getElementById("continue").classList.add("display-none");
			document.getElementById("confirm").classList.remove("display-none");

			const step2Element = document.getElementById("step-2");
			step2Element.classList.remove("current");
			step2Element.classList.add("done");

			document.getElementById("step-3").classList.add("current");
			document.getElementById(
				"step-count"
			).innerHTML = `Step ${state.step} of 3`;
	}
});

document.querySelectorAll(".input-field-topic").forEach((element) => {
	element.addEventListener("click", (_) => {
		element.classList.toggle("selected");

		const inputElement = element.getAttribute("for");
		const topic = inputElement.valueOf();
		if (state.topics.has(topic)) {
			state.topics.delete(topic);
		} else {
			state.topics.add(topic);
		}
	});
});

document.getElementById("step-count").textContent = `Step ${state.step} of 3`;
