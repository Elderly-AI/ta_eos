// Code generated by protoc-gen-go-grpc. DO NOT EDIT.

package auth

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// AuthClient is the client API for Auth service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type AuthClient interface {
	LoginHandler(ctx context.Context, in *LoginRequest, opts ...grpc.CallOption) (*User, error)
	RegisterHandler(ctx context.Context, in *RegisterRequest, opts ...grpc.CallOption) (*SafeUser, error)
	GetCurrentUser(ctx context.Context, in *EmptyRequest, opts ...grpc.CallOption) (*SafeUser, error)
}

type authClient struct {
	cc grpc.ClientConnInterface
}

func NewAuthClient(cc grpc.ClientConnInterface) AuthClient {
	return &authClient{cc}
}

func (c *authClient) LoginHandler(ctx context.Context, in *LoginRequest, opts ...grpc.CallOption) (*User, error) {
	out := new(User)
	err := c.cc.Invoke(ctx, "/auth.Auth/LoginHandler", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *authClient) RegisterHandler(ctx context.Context, in *RegisterRequest, opts ...grpc.CallOption) (*SafeUser, error) {
	out := new(SafeUser)
	err := c.cc.Invoke(ctx, "/auth.Auth/RegisterHandler", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *authClient) GetCurrentUser(ctx context.Context, in *EmptyRequest, opts ...grpc.CallOption) (*SafeUser, error) {
	out := new(SafeUser)
	err := c.cc.Invoke(ctx, "/auth.Auth/GetCurrentUser", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// AuthServer is the server API for Auth service.
// All implementations must embed UnimplementedAuthServer
// for forward compatibility
type AuthServer interface {
	LoginHandler(context.Context, *LoginRequest) (*User, error)
	RegisterHandler(context.Context, *RegisterRequest) (*SafeUser, error)
	GetCurrentUser(context.Context, *EmptyRequest) (*SafeUser, error)
	mustEmbedUnimplementedAuthServer()
}

// UnimplementedAuthServer must be embedded to have forward compatible implementations.
type UnimplementedAuthServer struct {
}

func (UnimplementedAuthServer) LoginHandler(context.Context, *LoginRequest) (*User, error) {
	return nil, status.Errorf(codes.Unimplemented, "method LoginHandler not implemented")
}
func (UnimplementedAuthServer) RegisterHandler(context.Context, *RegisterRequest) (*SafeUser, error) {
	return nil, status.Errorf(codes.Unimplemented, "method RegisterHandler not implemented")
}
func (UnimplementedAuthServer) GetCurrentUser(context.Context, *EmptyRequest) (*SafeUser, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetCurrentUser not implemented")
}
func (UnimplementedAuthServer) mustEmbedUnimplementedAuthServer() {}

// UnsafeAuthServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to AuthServer will
// result in compilation errors.
type UnsafeAuthServer interface {
	mustEmbedUnimplementedAuthServer()
}

func RegisterAuthServer(s grpc.ServiceRegistrar, srv AuthServer) {
	s.RegisterService(&Auth_ServiceDesc, srv)
}

func _Auth_LoginHandler_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(LoginRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AuthServer).LoginHandler(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/auth.Auth/LoginHandler",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AuthServer).LoginHandler(ctx, req.(*LoginRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Auth_RegisterHandler_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(RegisterRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AuthServer).RegisterHandler(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/auth.Auth/RegisterHandler",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AuthServer).RegisterHandler(ctx, req.(*RegisterRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Auth_GetCurrentUser_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(EmptyRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AuthServer).GetCurrentUser(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/auth.Auth/GetCurrentUser",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AuthServer).GetCurrentUser(ctx, req.(*EmptyRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// Auth_ServiceDesc is the grpc.ServiceDesc for Auth service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Auth_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "auth.Auth",
	HandlerType: (*AuthServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "LoginHandler",
			Handler:    _Auth_LoginHandler_Handler,
		},
		{
			MethodName: "RegisterHandler",
			Handler:    _Auth_RegisterHandler_Handler,
		},
		{
			MethodName: "GetCurrentUser",
			Handler:    _Auth_GetCurrentUser_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "proto/auth/auth.proto",
}