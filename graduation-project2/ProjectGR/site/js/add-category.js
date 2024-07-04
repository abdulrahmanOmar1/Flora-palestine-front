$(function () {
    $('#add-category-form').on('submit', function (event) {
        event.preventDefault();
        
        // Extract input values
        const name = $('#name').val(); // Category Name
        
        // Create categoryData object
        const categoryData = {
            name: name,
            adminId: 1 // Assuming adminId is a constant value or retrieved from session
        };
        
        addCategory(categoryData);
    });
});

function addCategory(categoryData) {
    axios.post('http://localhost:9090/api/categories/new', categoryData)
        .then(function (response) {
            console.log('Category added:', response.data);
            alert('Category added successfully!');
            $('#add-category-form').trigger('reset'); // Clear the form
        })
        .catch(function (error) {
            console.error('Error adding category:', error);
            alert('Error adding category. Please try again.');
        });
}
