import date_utils from './date_utils';

export default class Popup {
    constructor(parent, custom_html) {
        this.parent = parent;
        this.custom_html = custom_html;
        this.make();
    }

    make() {
        this.parent.innerHTML = `
            <div class="title"></div>
            <div class="subtitle"></div>
            <div class="pointer"></div>
        `;

        this.hide();

        this.title = this.parent.querySelector('.title');
        this.subtitle = this.parent.querySelector('.subtitle');
        this.pointer = this.parent.querySelector('.pointer');
    }

    show(options) {
        if (!options.target_element) {
            throw new Error('target_element is required to show popup');
        }
        if (!options.position) {
            options.position = 'left';
        }
        const target_element = options.target_element;

        if (this.custom_html) {
            let html = this.custom_html(options.task);
            html += '<div class="pointer"></div>';
            this.parent.innerHTML = html;
            this.pointer = this.parent.querySelector('.pointer');
        } else {
            // set data
            this.title.innerHTML =
                '<b>' + options.title + '</b><br/>' + options.subtitle + '';
            const duration = date_utils.diff(
                options.task._end,
                options.task._start,
                'day'
            );
            this.subtitle.innerHTML = 'Duration: ' + duration + ' days';
            this.parent.style.width = 175 + 'px'; // width of popup
        }

        // set position
        let position_meta;
        if (target_element instanceof HTMLElement) {
            position_meta = target_element.getBoundingClientRect();
        } else if (target_element instanceof SVGElement) {
            position_meta = options.target_element.getBBox();
        }

        if (options.position === 'left') {
            this.parent.style.left =
                position_meta.x + (position_meta.width + 8) + 'px';
            this.parent.style.top = position_meta.y - 20 + 'px'; // position of popup relative to target

            this.pointer.style.transform = 'rotateZ(90deg)';
            this.pointer.style.left = '-5px';
            this.pointer.style.top = '25px'; // position of pointer relative to popup (2px is top left corner)
        }
        // show
        this.parent.style.opacity = 1;
    }

    hide() {
        this.parent.style.opacity = 0;
        this.parent.style.left = 0;
    }
}
