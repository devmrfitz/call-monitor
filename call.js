const Fonoster = require("@fonoster/sdk");
    const numbers = new Fonoster.Numbers();

    const request = {
      providerRef: "516f1577bcf86cd797439012",
      e164Number: "+17853177343",
      ingressInfo: {
        webhook: "https://webhooks.acme.com/hooks"
      }
    };

    numbers.createNumber(request)
      .then(console.log).catch(console.error);
