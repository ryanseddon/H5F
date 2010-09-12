H5F
===

### a JavaScript library that allows you to use the HTML5 Forms chapters new field input types, attributes and constraint validation API in non-supporting browsers.

The H5F script will detect if the browser has support for the HTML5 Forms Chapter and either hook into the native methods, attributes and events or emulate the new features in non-supporting browsers.

### What's supported

H5F offers support for most, but not all, of the HTML5 Forms Chapter:

* Input types: email and url
* Input attributes: pattern, placeholder, min, max, step, required
* Textarea attributes: placeholder and required
* Select attributes: required

Also supported is the constraint validation API:

* Field validity object
* checkValidity() method on form or indivdual field

### Example

    <form id="signup">
        <label>Email</label>
        <input type="email" placeholder="e.g. ryan@example.net" required />
	
        <label>Phone</label> 
        <input type="tel" id="tel" name="tel" pattern="\d{10}" />
	
        <label>Post code *</label>
        <input type="number" min="1001" max="8000" required />
	
        <input type="submit" />
    </form>

On page load you run the H5F setup method:

H5F.setup(document.getElementById("signup"));

For a working demo download the demo files.

#### Passing multiple forms

You can pass a HTMLFormElement, HTMLCollection of HTMLFormElements, or Array of HTMLFormElements.

    H5F.setup([document.getElementById("form1"),document.getElementById("form2"),document.getElementById("form3")]);

#### Optional settings argument

The H5F.setup method also accepts a second optional argument so you can specify the fields validation class names:

    H5F.setup(document.getElementById("signup"), {
        validClass: "valid",
        invalidClass: "invalid",
        requiredClass: "required"
    });
	
[http://thecssninja.com/javascript/H5F](http://thecssninja.com/javascript/H5F)

Dual-licensed under the BSD and MIT licenses.