define(['views/policies/policies'],
    function (Policies) {
        return function () {
            var policies = new Policies.View({});
            this.show({view:policies, title:"Global Policies", globalOptions: { bodyClass: 'grey-body-bg', mainClass: 'no-padding'}});
        }
    });