var a = {
    data: function () {
        return {
            count: 0
        }
    },
    props: [
        'name'
    ],
    template: "<button @click='count++'>you click {{name}} {{count}} times.</button>"
}