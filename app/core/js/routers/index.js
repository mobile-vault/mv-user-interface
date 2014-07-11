define(['views/dashboard'],
    function (Dashboard) {
        return function () {
            var dashboard = new Dashboard.View({});
            this.show({view:dashboard, title:"Dashboard"});
        }
    });