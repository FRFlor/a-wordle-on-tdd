import {mount} from "@vue/test-utils"
import App from "@/App.vue"

describe("setting up the game", () => {
    it("accepts a 'rightAnswer' with 5 letters without giving any warnings", () => {
        console.warn = jest.fn()

        const wrapper = mount(App, {props: {rightAnswer: "TESTS"}})

        expect(wrapper.vm).toBeTruthy()
        expect(console.warn).not.toHaveBeenCalled()
    })

    it("provides a warning if the rightAnswer given does not have exactly 5 letters", () => {
        let hasWarnedAboutWordProp = false
        console.warn = jest.fn().mockImplementation((vueWarning) => {
            hasWarnedAboutWordProp = /invalid.*prop.*rightAnswer/ig.test(vueWarning)
        })

        mount(App, {props: {rightAnswer: "SomethingLargerThan5"}})

        expect(hasWarnedAboutWordProp).toBe(true)
    })
})