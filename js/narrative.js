onload = function(){

    ////////////////////////////////////////////////// INITIATION

    // 배경 별 처리
    
    initiationBackground();

    function initiationBackground() {
        const stars = document.getElementsByClassName('init-bg-stars');
        var starNum = 2500; // 별의 개수
        var starRange = 300; // 별까지의 최대 거리
        var starRangeUnit = 'vh '; // 별과의 거리 단위
        var starRangeRadixPoint = 2; // 별과의 거리 소수점 이하 자리수
        
        starMaker(stars[0], starNum, starRange, starRangeUnit, starRangeRadixPoint);
        starMaker(stars[1], (starNum / 20), starRange, starRangeUnit, starRangeRadixPoint);
    };
    
    function starMaker(starsItem, starNum, starRange, starRangeUnit, starRangeRadixPoint){
        var starValue = starDesignation();
        for (let i = 1; i < starNum; i++) starValue = starValue + ", " + starDesignation();
        
        starsItem.style.boxShadow = starValue;
        
        function starDesignation() {return randomNum() + starRangeUnit + randomNum() + starRangeUnit};
        function randomNum() {return (((Math.random() * 2 - 1) * starRange).toFixed(starRangeRadixPoint))};
    };





    ////////// Text Event Starter
    // 
    // 콘텐츠는 100vh 단위의 "뷰"로 분절되어 있다.
    // 스크롤을 통해 해당 "뷰"에 접근하였을 때, 이벤트가 발생한다.
    // 개별 뷰의 텍스트는 열 단위로 구분되고, 개별 열에는 다시 아이템 단위로 나뉜다.
    // 해당 뷰의 개별 아이템은 순차적으로 계산된 지연 시간에 따라 이벤트를 부여 받는다.
    
    const initContent = document.getElementsByClassName('initiation')[0];
    const contextContent = document.getElementsByClassName('context')[0];
    const sharpContent = document.getElementsByClassName('sharp-objects')[0];
    
    const initViews = document.getElementsByClassName('init-view');
    const contextViews = document.getElementsByClassName('context-view');
    const sharpViews = document.getElementsByClassName('sharp-view');
    
    const intervalTimeDelay = 1000; // 텍스트 이벤트 간 지연 시간

    textEventStarter(initContent, initViews, intervalTimeDelay);
    
    function textEventStarter(content, contentViews, intervalTimeDelay) {
        // 로드 시 이벤트 부여
        let viewRows = contentViews[0].children;
        textEvent(viewRows, intervalTimeDelay);

        // 로드 이후 이벤트 부여
        content.addEventListener('scroll', textEventFunction);

        function textEventFunction(){
            for (let i = 1; i < contentViews.length; i++) { 
                if (content.scrollTop >= (innerHeight * (i - 0.1))) {
                    let viewRows = contentViews[i].children;
                    textEvent(viewRows, intervalTimeDelay);
                }
            }
        }
    }

    function textEvent(viewRows, intervalTimeDelay){
        for (let rowNum = 0; rowNum < viewRows.length; rowNum++) {
            let rowChildren = viewRows[rowNum].children
            
            for (let itemNum = 0; itemNum < rowChildren.length; itemNum++) {
                let item = rowChildren[itemNum]
                let eventName = 'text-event' // 이벤트 부여를 위한 클래스명

                let eventOrder = textEventOrderFinder(viewRows, rowNum, itemNum); // 이벤트 순서 : '이벤트 간 지연 시간'과 곱하여 최종 지연 시간 부여
                
                eventInserter(item, eventName, eventOrder, intervalTimeDelay)
            }
        }
    }

    function textEventOrderFinder(viewRows, rowNum, itemNum){
        let eventOrder = 0

        if (rowNum > 0) eventOrder = rowNum * 0.5 // 줄 사이 지연시간 추가를 위한 처리
        for (let i = 0; i < rowNum; i++) eventOrder += viewRows[i].childElementCount // 앞줄 까지 진행된 순서를 계산
        eventOrder += itemNum // 같은 줄 안에서의 순서를 계산

        return eventOrder
    }

    function eventInserter(item, eventName, eventOrder, intervalTimeDelay){
        setTimeout(function(){
            item.classList.add(eventName)
        }, intervalTimeDelay * eventOrder) // 지연 시간과 순서를 곱해 개별 텍스트의 지연 시간을 설정
    }
    
    
    
    
    
    ////////// INITIATION EVENTS
    // 
    // 개별 View에서의 주요 키워드에 텍스트 이벤트 외에 부여하는 동적 이벤트를,
    // 해당 주요 키워드의 텍스트 이벤트 시기에 동기화하여 구현되도록 하였다.

    // eventStarter
    //
    // 특수한 경우를 제외한 이벤트를 위한 메소드

    eventStarter(initContent, 'init-2', 'girl-event');
    eventStarter(initContent, 'init-7', 'cuts-event', 0.5);
    
    function eventStarter(content, eventContainerName, eventName, timingAdjustor){
        let eventContainerNum = eventContainerName.substr((eventContainerName.length - 1), 1) - 1; // 컨테이너 열람을 위한 번호
        let eventTrigger = eventName + "-trigger"; // 이벤트 시기를 결정하는 엘리먼트의 클래스명
        
        let eventOrder = eventOrderFinder(content, eventTrigger, eventContainerNum, timingAdjustor); // 이벤트 시기 확인

        let item = content.children[eventContainerNum];
        
        content.addEventListener('scroll', eventFunction);

        function eventFunction(){
            if (content.scrollTop >= (innerHeight * (eventContainerNum - 0.1))) {
                eventInserter(item, eventName, eventOrder, intervalTimeDelay);
            };
        };
    };
    
    function eventOrderFinder(content, eventTrigger, eventContainerNum, timingAdjustor){
        let location = eventLocator(content, eventTrigger, eventContainerNum); // 트리거가 위치한 줄과 줄 내부 위치 확인
        
        let viewRows = content.children[eventContainerNum].children[0].children;
        let eventOrder = textEventOrderFinder(viewRows, location[0], location[1]); // 뷰 내부 이벤트 순번 확인
        if(timingAdjustor != null) eventOrder += timingAdjustor; // 이벤트 시기 조정
        
        return eventOrder;
    };
    
    function eventLocator(content, eventTrigger, eventContainerNum){
        let container = content.children[eventContainerNum].children[0];
        let rows = container.children;
        
        for (let rowNum = 0; rowNum < rows.length; rowNum++) {
            let row = rows[rowNum];
            let items = row.children;

            for (let itemNum = 0; itemNum < items.length; itemNum++) {
                let itemClassNames = items[itemNum].classList;

                for (let i = 0; i < itemClassNames.length; i++) {
                    let itemClassName = itemClassNames[i];
                    if (itemClassName == eventTrigger) {
                        return [rowNum, itemNum]; // 줄 번호와 줄 내부의 아이템 번호 출력
                    };
                };
            };
        };
    };
    
        

    // Owls Event
    //
    // '뷰'의 무작위 위치에 정해진 수 만큼의 엘리먼트를 놓고, 엘리먼트에 transform 및 animation 등 속성 부여
    // transform은 개별 엘리먼트 당 하나만 부여받으므로 엘리먼트를 컨테이너로 감싸도록 구현
    
    owlsEvent();
    
    function owlsEvent() {
        // 이벤트 기본 세팅
        let itemName = 'owls-event';
        let itemContainerName = 'owls-event-container';
        let itemContainerNameBefore = 'owls-event-container-before';
        let itemNum = 90; // 추가할 아이템 숫자
        let itemSize = [3, 4]; // 아이템의 최대 크기(%) [height, width]
        
        // 아이템이 위치할 수 없는 공간(%)
        let restrictAreaX = [5, 65, 100]; // [a, b, c] a, b, d, e를 꼭지점으로 하는 사각형 공간에 아이템이 들어올 수 없음
        let restrictAreaY = [38, 61, 100]; // [d, e, f] c, f는 엘리먼트가 해당 '뷰' 영역 밖으로 나가는 걸 방지
        
        restrictAreaX[0] = restrictAreaX[0] - itemSize[0] - 1;
        restrictAreaX[1] = restrictAreaX[1] + 1;
        restrictAreaX[2] = restrictAreaX[2] - itemSize[0] - 1;
        restrictAreaY[0] = restrictAreaY[0] - itemSize[1] - 1;
        restrictAreaY[1] = restrictAreaY[1] + 1;
        restrictAreaY[2] = restrictAreaY[2] - itemSize[1] - 1;
        
        // 아이템 생성
        let items = itemCreator(itemName, itemContainerNameBefore, itemNum, itemSize, restrictAreaX, restrictAreaY);
        
        let eventContainerName = 'init-2';
        let eventTrigger = 'owls-event-trigger';
        let timingAdjustor = 0.5;
        let eventContainerNum = eventContainerName.substr((eventContainerName.length - 1), 1) - 1;
        
        // 이벤트 부여 시기 확인
        let eventOrder = eventOrderFinder(initContent, eventTrigger, eventContainerNum, timingAdjustor);
        
        // 아이템 삽입
        owlsEventInserter(initContent, eventContainerName, eventContainerNum, items, itemContainerName, itemContainerNameBefore, eventOrder);
        
        function itemCreator(itemName, itemContainerNameBefore, itemNum, itemSize, restrictAreaX, restrictAreaY) {
            let items = []; // 엘리먼트를 모아 놓는 배열
            let itemPositionArray = []; // 기생성 엘리먼트의 위치 속성을 저장하는 배열 (엘리먼트 간 겹침 방지)

            for (let i = 0; i < itemNum; i++) {
                var item = document.createElement("span"); // 실제 효과가 들어갈 엘리먼트
                item.className = itemName;
                itemTransformer(item); // transform 속성 부여

                var itemContainer = document.createElement("span"); // 애니메이션 및 위치를 부여받을 엘리먼트
                itemContainer.className = itemContainerNameBefore;
                itemContainer.appendChild(item);
                
                // 위치 값 생성 및 부여
                let positionValue = itemPositionSelector(restrictAreaX, restrictAreaY, itemSize, itemPositionArray);
                itemContainer.style.left = (positionValue[0]).toFixed(1) + '%';
                itemContainer.style.top = (positionValue[1]).toFixed(1) + '%';
                
                itemAnimationSelctor(itemContainer); // 애니메이션 부여
                
                items.push(itemContainer);
            };

            return items;
        };
        
        function itemTransformer(item) {
            if(Math.random()>=0.5){ // rotate 값 프로그램
                let rotateValue = (Math.random() - 0.5) * 2;
                rotateValue = (Math.floor(rotateValue * 45)).toFixed(0);
                
                item.style.transform = item.style.transform + ' rotate(' + rotateValue + 'deg)';
            };

            if(Math.random()>=0.5){ // scale 값 프로그램
                let scaleValue = ((Math.random() * 0.7) + 0.3).toFixed(1);
                
                item.style.transform = item.style.transform + ' scale(' + scaleValue + ')';
            };
        };
        
        function itemPositionSelector(restrictAreaX, restrictAreaY, itemSize, itemPositionArray){
            let X = Math.random()*100;
            let Y = Math.random()*100;
            let positionValue = [X, Y];

            // 제한 구역 침입 방지
            if ((X >= restrictAreaX[0] &&
                X <= restrictAreaX[1] &&
                Y >= restrictAreaY[0] &&
                Y <= restrictAreaY[1])
                || X >= restrictAreaX[2]
                || Y >= restrictAreaY[2]){

                positionValue = itemPositionSelector(restrictAreaX, restrictAreaY, itemSize, itemPositionArray);
            };
            
            // 엘리먼트 간 겹침 방지
            if(itemPositionArray.length > 0){
                for (let i = 0; i < itemPositionArray.length; i++) {
                    let preX = itemPositionArray[i][0];
                    let preY = itemPositionArray[i][1];
                    let restrictItemX = [preX - itemSize[0] - 1, preX + itemSize[0] + 1];
                    let restrictItemY = [preY - itemSize[1] - 1, preY + itemSize[1] + 1];

                    if (X >= restrictItemX[0] &&
                        X <= restrictItemX[1] &&
                        Y >= restrictItemY[0] &&
                        Y <= restrictItemY[1]){

                        positionValue = itemPositionSelector(restrictAreaX, restrictAreaY, itemSize, itemPositionArray);
                    };
                };
            };

            itemPositionArray = itemPositionArray.concat([positionValue]); // 아이템 위치 배열에 value 추가 
            
            return positionValue;
        };

        function itemAnimationSelctor(item) {
            let animationNameArray = ['owls-eyes-1', 'owls-eyes-2', 'owls-eyes-3']; // 부여할 애니메이션 이름
            let nameArrayNum = Math.floor(Math.random() * 3);
            
            item.style.animationName = animationNameArray[nameArrayNum];
            
            let animationDurationValue = Math.round((Math.random() * 20) + 10);
    
            item.style.animationDuration = animationDurationValue + 's'; // 애니메이션 부여
        };

        function owlsEventInserter(content, eventContainerName, eventContainerNum, items, itemContainerName, itemContainerNameBefore, eventOrder){
            let eventContainer = document.getElementsByClassName(eventContainerName)[0].children[0];
            for (let itemNum = 0; itemNum < items.length; itemNum++) eventContainer.appendChild(items[itemNum]); // 엘리먼트 삽입
            
            content.addEventListener('scroll', eventFunctionOwls); // 이벤트 리스너 삽입
            
            function eventFunctionOwls(){ // 엘리먼트 이벤트 시기 부여 프로그램
                if (content.scrollTop >= (innerHeight * (eventContainerNum - 0.1))) {
                    var itemsBefore = document.getElementsByClassName(itemContainerNameBefore);
                    setTimeout(function(){
                        for (let item = 0; item < itemsBefore.length; item++) itemsBefore[item].classList.add(itemContainerName); // 엘리먼트
                        content.removeEventListener('scroll',eventFunctionOwls); // 이벤트 리스너 삭제
                    }, intervalTimeDelay * eventOrder);
                };
            };
        };
    };





    ////////////////////////////////////////////////// APPROACHES EVENTS

    const approaches = document.getElementsByClassName('approaches')[0];
    const approachOpenButton = document.getElementsByClassName('approach-button')[0];
    const approachCloseButton = document.getElementsByClassName('approach-close')[0];


    // Approach open buutton opacity change
    initContent.addEventListener('scroll', function(){
        if (initContent.scrollTop >= (initViews.length - 1.1) * innerHeight) {
            setTimeout(function(){
                approachOpenButton.style.opacity = '1';
            }, intervalTimeDelay * (5.4));
        }
    })
    

    // Approach Buttons "Click" events
    approachOpenButton.addEventListener('click', function(){
        approaches.style.bottom = '0'
        approachOpenButton.style.opacity = '1'
        initContent.style.overflowY = 'hidden'

        for (let i = 0; i < initViews.length; i++) {
            initViews[i].style.opacity = '0';
        }
    })
    approachCloseButton.addEventListener('click',function(){
        approaches.style.bottom = null;
        initContent.style.overflowY = null;

        for (let i = 0; i < initViews.length; i++) {
            initViews[i].style.opacity = null;
        };
    });


    // Approach Items "Hover" events
    const approachContext = document.getElementsByClassName('approach-context')[0].firstElementChild;
    const approachItems = document.getElementsByClassName('approach-item');
    const approachLeave = document.getElementsByClassName('approach-leave')[0].firstElementChild;
    
    approachContext.addEventListener('mouseover',approachTextLine);
    approachLeave.addEventListener('mouseover',approachTextLine);
    approachContext.addEventListener('mouseout',approachTextLineReversal);
    approachLeave.addEventListener('mouseout',approachTextLineReversal);

    function approachTextLine(){
        for (let i = 0; i < approachItems.length; i++) {
            approachItems[i].style.textDecoration = 'line-through';
        }
    };
    
    function approachTextLineReversal(){
        for (let i = 0; i < approachItems.length; i++) {
                approachItems[i].style.textDecoration = null;
        }
    };
    

    // Context open and close
    approachContext.addEventListener('click', function(){
        contextContent.style.top = '0';
        textEventStarter(contextContent, contextViews, intervalTimeDelay);
    });
    
    const contextCloseButton = document.getElementsByClassName('context-close')[0];
    contextCloseButton.addEventListener('click', function(){
        contextContent.style.top = null;
    });
    
    
    // Sharp Object open and close
    approachItems[0].addEventListener('click', function(){
        sharpContent.style.left = '0';
        textEventStarter(sharpContent, sharpViews, intervalTimeDelay);
    });

    const sharpCloseButton = document.getElementsByClassName('sharp-close')[0];
    sharpCloseButton.addEventListener('click', function(){
        sharpContent.style.left = null;
    });
}