$(function () {
    $('#add-category-form').on('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        addCategory(formData);
    });
});

function addCategory(formData) {
    axios.post('URL_TO_YOUR_BACKEND_API/categories', formData)
        .then(function (response) {
            console.log('Category added:', response.data);
            alert('Category added successfully!');
            // Clear the form
            document.getElementById('add-category-form').reset();
        })
        .catch(function (error) {
            console.error('There was an error adding the category!', error);
        });
}
