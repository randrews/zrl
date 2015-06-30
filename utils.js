function patch9(ctx, image, w, h){
    w = Math.floor(w / 48);
    h = Math.floor(h / 48);

    // Corners
    ctx.drawImage( image,
                   0, 0, 48, 48,
                   0, 0, 48, 48 );

    ctx.drawImage( image,
                   96, 0, 48, 48,
                   (w-1) * 48, 0,
                   48, 48 );

    ctx.drawImage( image,
                   0, 96, 48, 48,
                   0, (h-1) * 48,
                   48, 48 );

    ctx.drawImage( image,
                   96, 96, 48, 48,
                   (w-1) * 48, (h-1) * 48,
                   48, 48 );

    // Top / btm edges
    for(var n=1; n <= w-2; n++){
        ctx.drawImage( image,
                       48, 0, 48, 48,
                       n*48, 0, 48, 48 );

        ctx.drawImage( image,
                       48, 96, 48, 48,
                       n*48, (h-1) * 48, 48, 48 );
    }

    // Left / right edges
    for(var n=1; n <= h-2; n++){
        ctx.drawImage( image,
                       0, 48, 48, 48,
                       0, n*48, 48, 48 );

        ctx.drawImage( image,
                       96, 48, 48, 48,
                       (w-1) * 48, n*48, 48, 48 );
    }

    // Middle
    for(var xn=1; xn <= w-2 ; xn++)
        for(var yn=1; yn <= h-2 ; yn++){
            ctx.drawImage( image,
                           48, 48, 48, 48,
                           xn*48, yn*48, 48, 48 );
        }
}

function inRect(pt, geometry){
    return (pt.x >= geometry.x && pt.y >= geometry.y &&
            pt.x < geometry.x+geometry.width &&
            pt.y < geometry.y+geometry.height);
};
