
var DragManager;
DragManager = new function () {

    /**
     * составной объект для хранения информации о переносе:
     * {
   *   elem - элемент, на котором была зажата мышь
   *   avatar - аватар
   *   downX/downY - координаты, на которых был mousedown
   *   shiftX/shiftY - относительный сдвиг курсора от угла элемента
   * }
     */

    var dragObject = {};

    function repls(start, end, mass) {
        start = start.split('');
        end = end.split('');
        if (start == undefined) return;
        if (end == undefined) return;
        //console.log(+start[0], +start[1]);
        //console.log(+end[0], +end[1]);
        var temp = mass[+start[0]][+start[1]];
        mass[+start[0]][+start[1]] = mass[+end[0]][+end[1]];
        mass[+end[0]][+end[1]] = temp;
        return mass;
    }

    function onMouseDown(e) {
        if (e.which == 1) {
            //log("touchstart  ");
            var elem = e.target.closest('.draggable');
            if (!elem) return;
            dragObject.elem = elem;
            dragObject.downX = e.pageX;
            dragObject.downY = e.pageY;
            //log("touchstart  " +dragObject.downX +";"+ dragObject.downY);
            //log("touchstart  " +dragObject.elem);
            var tdID = document.elementFromPoint(dragObject.downX, dragObject.downY);
            tdID = tdID.parentNode;
            //log("touchstart  " +tdID);
            dragObject.startID = tdID.id;
            //log("touchstart  " +dragObject.startID);
            return false;
        }
        else {
            //e.preventDefault();
            log("touchstart  ");
            var elem = e.target.closest('.draggable') || e.targetTouches.closest('.draggable')[0];
            if (!elem) return;
            dragObject.elem = elem;
            // запомним, что элемент нажат на текущих координатах pageX/pageY
            dragObject.downX = e.pageX || e.targetTouches[0].pageX;
            dragObject.downY = e.pageY || e.targetTouches[0].pageY;
            //log("touchstart  " +dragObject.downX +";"+ dragObject.downY);
            //log("touchstart  " +dragObject.elem);
            var tdID = document.elementFromPoint(dragObject.downX, dragObject.downY);
            tdID = tdID.parentNode;
            //log("touchstart  " +tdID);
            dragObject.startID = tdID.id;//начальная коодината движения div
            //log("touchstart  " +dragObject.startID);
            return false;
        }
    }
    this.mouseM = onMouseMove;
    function onMouseMove(e) {
        e.preventDefault();
        if (!dragObject.elem) return; // элемент не зажат
        //log("touchmove  " +dragObject.elem);
        if (!dragObject.avatar) { // если перенос не начат...
            var moveX = e.pageX - dragObject.downX;
            var moveY = e.pageY - dragObject.downY;
            // если мышь передвинулась в нажатом состоянии недостаточно далеко
            if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) return;
            // начинаем перенос
            dragObject.avatar = createAvatar(e); // создать аватар
            if (!dragObject.avatar) { // отмена переноса, нельзя "захватить" за эту часть элемента
                //log("touchmove not avatar");
                dragObject = {};
                return;
            }
            //log("touchmove ");
            // аватар создан успешно
            // создать вспомогательные свойства shiftX/shiftY
            var coords = getCoords(dragObject.avatar);
            dragObject.shiftX = dragObject.downX - coords.left;
            dragObject.shiftY = dragObject.downY - coords.top;
            //log("touchmove  " +dragObject.shiftX +";"+ dragObject.shiftY);
            startDrag(e); // отобразить начало переноса
        }

        // отобразить перенос объекта при каждом движении мыши
        dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
        dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';
        return false;
    }

    function onMouseUp(e) {
        //e.preventDefault();
        if (dragObject.avatar) { // если перенос идет
            //log("touchend ");
            finishDrag(e);
        }
        // перенос либо не начинался, либо завершился
        // в любом случае очистим "состояние переноса" dragObject
        dragObject = {};
        //log("touchend end");
    }

    function createAvatar(e) {
        // запомнить старые свойства, чтобы вернуться к ним при отмене переноса
        var avatar = dragObject.elem;
        var old = {
            parent: avatar.parentNode,
            nextSibling: avatar.nextSibling,
            position: avatar.position || '',
            left: avatar.left || '',
            top: avatar.top || '',
            zIndex: avatar.zIndex || ''
        };
        // функция для отмены переноса
        avatar.rollback = function () {
            old.parent.insertBefore(avatar, old.nextSibling);
            avatar.style.position = old.position;
            avatar.style.left = old.left;
            avatar.style.top = old.top;
            avatar.style.zIndex = old.zIndex
        };
        //log("createAvatar "+ avatar);
        return avatar;
    }

    function startDrag(e) {
        var avatar = dragObject.avatar;
        // инициировать начало переноса
        document.body.appendChild(avatar);
        avatar.style.zIndex = 9999;
        avatar.style.position = 'absolute';
        //log("startDrag ");
    }

    function finishDrag(e) {
        //log("finishDrag ");
        var dropElem = findDroppable(e);
        if (!dropElem) {
            dragObject.avatar.rollback();
            return;
        }
        //log("finishDrag "+ dropElem);
        dropElem.appendChild(dragObject.elem);
        repls(dragObject.startID, dragObject.endID, arrGamer);//корекция массива таблици с кораблями
    }

    function findDroppable(e) {
        if (e.which == 1) {
            dragObject.endX = e.pageX;
            dragObject.endY = e.pageY;
            //log("findDroppable ");
            //log("findDroppable  " +dragObject.endX +";"+ dragObject.endY);
            dragObject.avatar.hidden = true;
            var elem = document.elementFromPoint(dragObject.endX, dragObject.endY);
            dragObject.endID = elem.id;
            //log("findDroppable " + elem.parentNode.id);
            //log("end No cell  " + dragObject.endID);
            dragObject.avatar.hidden = false;
            if (elem.parentNode.id) {
                //log('alarm td fool');
                dragObject.avatar.rollback();// если курсор мыши попал на td с div
                return null;
            }
            if (elem != 'td') {
                //log('alarm not warfild');
                dragObject.avatar.rollback();
            }
            //log("findDroppable2 ");
            return elem.closest('.droppable');
        }
        else {
            dragObject.endX = e.pageX || e.changedTouches[0].pageX;
            dragObject.endY = e.pageY || e.changedTouches[0].pageY;
            //log("findDroppable ");
            //log("findDroppable  " +dragObject.endX +";"+ dragObject.endY);
            // спрячем переносимый элемент
            dragObject.avatar.hidden = true;
            // получить самый вложенный элемент под курсором мыши
            var elem = document.elementFromPoint(dragObject.endX, dragObject.endY);
            dragObject.endID = elem.id;//конечная коодината движения div
            //log("findDroppable " + elem.parentNode.id);
            //log("end No cell  " + dragObject.endID);
            // показать переносимый элемент обратно
            dragObject.avatar.hidden = false;
            if (elem.parentNode.id) {
                //log('alarm td fool');
                dragObject.avatar.rollback();// если курсор мыши попал на td с div
                return null;
            }
            if (elem != 'td') {
                //log('alarm not warfild');
                dragObject.avatar.rollback();
                // такое возможно, если курсор мыши "вылетел" за границу окна
            }
            //log("findDroppable2 ");
            return elem.closest('.droppable') || elem.changedTouches.closest('.draggable')[0];
        }
    }

    // document.onmousedown = onMouseDown;
    // document.onmousemove = onMouseMove;
    // document.onmouseup = onMouseUp;

    document.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mouseup', onMouseUp, false);

    document.addEventListener('touchstart', onMouseDown, false);
    document.addEventListener('touchmove', onMouseMove, false);
    document.addEventListener('touchend', onMouseUp, false);

/*    function log(msg) {
        var p = document.getElementById('log');
        p.innerHTML = msg + "\n" + p.innerHTML;
    }*/
};


function getCoords(elem) { // кроме IE8-
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}

document.onmouseover = document.onmouseout = handler;
var currentElem = null;
var bgColor = null;
function handler(event) {
    var target = event.target;
    if (target.tagName == 'TD' && event.type == 'mouseover') {
        if (currentElem) {return;}
        bgColor = target.style.backgroundColor;
        //console.log(bgColor);
        currentElem = target;
        target.style.background = 'pink';
        target = target.parentNode;
    }
    if (target.tagName == 'TD' && event.type == 'mouseout') {
        if (!currentElem) {return;}
        var relatedTarget = event.relatedTarget;
        if (relatedTarget) {
            while (relatedTarget) {
                if (relatedTarget == currentElem) {return;}
                relatedTarget = relatedTarget.parentNode;
            }
        }
        currentElem.style.background = bgColor;
        currentElem = null;
        bgColor = null;
    }
}