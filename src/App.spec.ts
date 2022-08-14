import {mount} from "@vue/test-utils"
import App from "@/App.vue"

it("accepts a 'rightAnswer'", () => {
    const wrapper = mount(App, {props: {rightAnswer: "TESTS"}})
    expect(wrapper.vm).toBeTruthy()
})