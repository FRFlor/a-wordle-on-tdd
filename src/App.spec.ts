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

describe("ending the game", () => {
    it("does not display game ending messages until the game is over", () => {
        const wrapper = mount(App, {props: {rightAnswer: "TESTS"}})

        expect(wrapper.find("[data-role=winning-message]").exists()).toBe(false)
        expect(wrapper.find("[data-role=losing-message]").exists()).toBe(false)
    })

    it("displays a victory message when the player guesses the right word correctly", async () => {
        // Arrange: Instantiate the App
        const wrapper = mount(App, {props: {rightAnswer: "TESTS"}})

        // Act: Type the correct guess and submit
        await wrapper.find("[data-role=guess]").setValue("TESTS")
        await wrapper.find("[data-role=guess]").trigger("keydown.enter")

        // Assert: Verify that the winning message is in display
        expect(wrapper.find("[data-role=winning-message]").exists()).toBe(true)
    })

    it.todo("displays a failure message when the player guesses wrong")
})

