import {mount} from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";

it('renders the message that is given', () => {
    const message = "Lets practice TDD!"
    const wrapper = mount(HelloWorld, {props: {msg: message}})

    expect(wrapper.text()).toContain(message)
})