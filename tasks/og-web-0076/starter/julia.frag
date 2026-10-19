#version 300 es
precision highp float;
precision highp int;
uniform vec2 resolution;
uniform int color_method;
uniform int smoothing;
uniform vec4 gradient_start;
uniform vec4 gradient_end;
uniform vec4 gradient_accent;
uniform float accent_position;
uniform float accent_width;
uniform float red_frequency;
uniform float green_frequency;
uniform float blue_frequency;
uniform float red_phase;
uniform float green_phase;
uniform float blue_phase;
uniform float scale;
uniform vec2 position;
uniform float aspect_ratio;
uniform vec2 seed;
uniform float power;
uniform float iterations;
uniform float escape;
const vec2 DEFAULT_SEED=vec2(-0.794084,0.136444);
out vec4 outputColor;
vec2 complexPower(vec2 base,float exponent){float radius=length(base),angle=atan(base.y,base.x);return pow(radius,exponent)*vec2(cos(angle*exponent),sin(angle*exponent));}
vec4 getColor(float i){if(color_method==1){vec4 ramp=mix(gradient_start,gradient_end,i);float gaussian=exp(-pow(i-accent_position,2.0)/(2.0*accent_width*accent_width));vec4 accent=vec4(gradient_accent.rgb*gaussian,gaussian);return vec4(accent.rgb*accent.a+ramp.rgb*ramp.a*(1.0-accent.a),1.0);}return vec4((sin(vec3(red_frequency,green_frequency,blue_frequency)*6.5*i+vec3(red_phase,green_phase,blue_phase))+1.0)/2.0,1.0);}
void main(){vec2 uv=vec2(gl_FragCoord.x/resolution.x,1.0-gl_FragCoord.y/resolution.y);vec2 z=vec2(aspect_ratio*(uv.x-.5)/scale-position.x,(uv.y-.5)/scale+position.y);float i=0.0;while(i<iterations&&length(z)<=escape){z=(power==2.0?vec2(z.x*z.x-z.y*z.y,power*z.x*z.y):complexPower(z,power))+seed;i++;}if(i>=iterations)outputColor=vec4(0,0,0,1);else{if(smoothing==1&&power>1.0)i-=log(log(length(z)))/log(power);outputColor=getColor(i/iterations);}}
