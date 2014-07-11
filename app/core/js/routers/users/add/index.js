define(
    function () {
        return function (type) {
            if(type === 'singleUser')
            {
                this.show({
                    title   : 'New User',
                    view    : 'views/newUserForm'
                });
            }
            else if(type === 'bulkUpload')
            {
                this.show({
                    title   : 'Bulk Upload',
                    view    : 'views/bulkUploader'
                });
            }
        }
    });