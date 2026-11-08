namespace GScores.Dtos;

public record SubjectDistributionDto(string Code, string Name, int Excellent, int Good, int Average, int Poor);

public record TopStudentDto(string Sbd, decimal Math, decimal Physics, decimal Chemistry, decimal Total);
