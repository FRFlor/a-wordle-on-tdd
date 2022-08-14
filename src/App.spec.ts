import {mount} from "@vue/test-utils"
import App from "@/App.vue"

it("accepts a 'rightAnswer'", () => {
    const wrapper = mount(App, {props: {rightAnswer: "TESTS"}})
    expect(wrapper.vm).toBeTruthy()
})

it("provides a warning if the rightAnswer given does not have exactly 5 letters", () => {
    // Arrange
    let hasWarnedAboutWordProp = false
    console.warn = jest.fn().mockImplementation((vueWarning) => {
        hasWarnedAboutWordProp = /invalid.*prop.*rightAnswer/ig.test(vueWarning)
    })

    // Act
    mount(App, {props: {word: "SomethingLargerThan5"}})

    // Assert
    expect(hasWarnedAboutWordProp).toBe(true)
})